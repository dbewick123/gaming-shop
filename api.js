require('dotenv').config();
const express = require('express');
const session = require('express-session');
const sequelize = require('./src/config/database');
const { userRouter } = require('./src/routes/user/userRoute'); 
const productRouter = require('./src/routes/product/productRoute'); 
const orderRouter = require('./src/routes/order/orderRoute'); 
const cartRouter = require('./src/routes/cart/cartRoute'); 


const app = express();

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000, httpOnly: true }, 
  })
);

// Connect to DB
sequelize.authenticate()
  .catch(err => console.error('Database connection error:', err));

// Use Routes
app.use('/user', userRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter); 
app.use('/cart', cartRouter); 

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; 