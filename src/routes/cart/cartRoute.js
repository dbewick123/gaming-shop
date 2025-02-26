const express = require('express');
const { isAuthenticated } = require('../user/userRoute');
const { Cart, CartItem, Product } = require('../../models/index');


const cartRouter = express.Router();

// Fetch user's cart with items
cartRouter.get('/', isAuthenticated, async (req, res) => {
  const user_id = req.session.user.id;

  try {
    const cart = await Cart.findOne({
      where: { user_id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            { model: Product, as: 'product' },
          ],
        },
      ],
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: error });
  }
});

// Create a new cart with at least one item
cartRouter.post('/', isAuthenticated, async (req, res) => {
  const user_id = req.session.user.id;


  // Validate input
  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Check if user already has a cart
    const existingCart = await Cart.findOne({ where: { user_id } });
    if (existingCart) {
      return res.status(400).json({ message: 'User already has a cart' });
    }

    // Start transaction
    const result = await Cart.sequelize.transaction(async (t) => {
      // Create cart
      const newCart = await Cart.create({ user_id }, { transaction: t });

      return newCart;
    });

    res.status(201).json({ message: 'Cart created', cart: result });
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update cart items (replace existing items)
cartRouter.put('/', isAuthenticated, async (req, res) => {
    const user_id = req.session.user.id;
    const { items } = req.body;
  
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'At least one item is required' });
    }
  
    try {
      const cart = await Cart.findOne({ where: { user_id } });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Start transaction
      await Cart.sequelize.transaction(async (t) => {
        for (const item of items) {
          const { product_id, quantity } = item;
  
          if (quantity < 0) {
            throw new Error(`Quantity cannot be negative for product ID ${product_id}`);
          }
  
          // Check if product exists
          const product = await Product.findByPk(product_id);
          if (!product) {
            throw new Error(`Product with ID ${product_id} not found`);
          }
  
          // Find existing cart item
          const existingCartItem = await CartItem.findOne({
            where: { cart_id: cart.id, product_id },
            transaction: t,
          });
  
          if (existingCartItem) {
            if (quantity === 0) {
              // ✅ Remove item if quantity is zero
              await CartItem.destroy({
                where: { cart_id: cart.id, product_id },
                transaction: t,
              });
            } else {
              // ✅ Update quantity
              existingCartItem.quantity = quantity;
              await existingCartItem.save({ transaction: t });
            }
          } else {
            if (quantity > 0) {
              // ✅ Add new item if it doesn't exist and quantity > 0
              await CartItem.create({
                cart_id: cart.id,
                product_id,
                quantity,
              }, { transaction: t });
            }
            // If quantity is 0, do nothing (item doesn't exist yet)
          }
        }
      });
  
      res.json({ message: 'Cart updated successfully' });
    } catch (error) {
      console.error('Error updating cart:', error);
      res.status(500).json({ error: error.message });
    }
  });

module.exports = cartRouter;
