const express = require('express');
const { isAuthenticated } = require('../user/userRoute');
const { Product,  ProductReview} = require('../../models/index'); 

const productRouter = express.Router();

//Fetch all products
productRouter.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error });
  }
});

//Fetch single product by ID
productRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error });
  }
});

// Update product stock
productRouter.put('/:id/stock', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  // Basic validation
  if (stock === undefined || stock < 0) {
    return res.status(400).json({ message: 'Invalid Stock Value' });
  }

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update stock
    product.stock = stock;
    await product.save();

    res.json({ message: 'Stock Updated', product });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: error });
  }
});

// Fetch reviews for a product
productRouter.get('/:id/reviews', async (req, res) => {
    const { id } = req.params;
    try {
      const reviews = await ProductReview.findAll({ where: { product_id: id } });
      if (!reviews.length) {
        return res.status(404).json({ message: 'No reviews found for this product' });
      }
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      res.status(500).json({ error: error });
    }
});
  
// Post a review for a product
productRouter.post('/:userid/:id/reviews', isAuthenticated, async (req, res) => {
    const { id, userid } = req.params;
    const { rating, comment } = req.body;
    // Basic validation
    if (!userid || !rating) {
      return res.status(400).json({ message: 'User ID and rating are required' });
    }
  
    try {
      const newReview = await ProductReview.create({
        product_id: id,
        user_id: userid,
        rating,
        comment,
      });
  
      res.status(201).json({ message: 'Review Added', review: newReview });
    } catch (error) {
      console.error('Error adding product review:', error);
      res.status(500).json({ error: error });
    }
});

module.exports = productRouter;
