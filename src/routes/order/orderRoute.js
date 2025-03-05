const express = require('express');
const { isAuthenticated } = require('../user/userRoute');
const { Order, OrderItem, Product } = require('../../models/index');


const orderRouter = express.Router();

// Fetch a single order by ID with its items
orderRouter.get('/:userid/:id', isAuthenticated, async (req, res) => {
  const { id, userid } = req.params;

  try {
    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    else if (order.dataValues.user_id != userid) {
      return res.status(403).json({ message: 'Order belongs to another user' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error });
  }
});

// Create a new order with items
orderRouter.post('/:userid', isAuthenticated, async (req, res) => {
  const { items } = req.body;
  const userid = req.params.userid;

  // Basic validation
  if (!userid || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'User ID and items are required' });
  }

  try {
    let total = 0;

    // Start transaction
    const result = await Order.sequelize.transaction(async (t) => {
      // Create the order
      const newOrder = await Order.create(
        {
          user_id: userid,
          total: 0,  // Temp total, will update later
          status: 'pending',
        },
        { transaction: t }
      );

      // Process items
      for (const item of items) {
        const { product_id, quantity } = item;

        const product = await Product.findByPk(product_id, {
            transaction: t,
            lock: t.LOCK.UPDATE,  // Row-level lock
        });

        if (!product) {
          throw new Error(`Product with ID ${product_id} not found`);
        }

        if (product.stock < quantity) {
          throw new Error(`Insufficient stock for product ID ${product_id}`);
        }

        // Deduct stock
        product.stock -= quantity;
        await product.save({ transaction: t });

        // Calculate total
        total += parseFloat(product.price) * quantity;

        // Create OrderItem
        await OrderItem.create(
          {
            order_id: newOrder.id,
            product_id,
            quantity,
          },
          { transaction: t }
        );
      }

      // Update order total
      newOrder.total = total;
      await newOrder.save({ transaction: t });

      return newOrder;
    });

    res.status(201).json({ message: 'Order Created', order: result });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = orderRouter;
