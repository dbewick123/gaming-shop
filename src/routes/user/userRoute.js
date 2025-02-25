const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../../models/index'); 


const userRouter = express.Router();

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  return res.status(401).json({ message: 'Unauthorized' });
};

// Login Route
userRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.user = { id: user.id, email: user.email };
    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Logout Route
userRouter.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

// Signup Route
userRouter.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    // Check if the email is already taken
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Respond with the new user's info (excluding password)
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      message: 'User created successfully!',
    });
  } catch (error) {
    console.error('Signup error: ', error);
    res.status(500).json({ error: error });
  }
});


// Get User (Authenticated)
userRouter.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id, {
      attributes: ['id', 'name', 'email'],
    });

    if (!user) return res.status(404).json({ message: 'User Not Found' });

    res.json(user);
  } catch (error) {
    console.error('Get user error: ', error);
    res.status(500).json({ error: error });
  }
});

// Update User (Authenticated)
userRouter.put('/', isAuthenticated, async (req, res) => {
  const { name, email } = req.body;

  try {
    const [updated] = await User.update(
      { name, email },
      { where: { id: req.session.user.id } }
    );

    if (!updated) return res.status(404).json({ message: 'User Not Found' });

    const updatedUser = await User.findByPk(req.session.user.id, {
      attributes: ['id', 'name', 'email'],
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error: ', error);
    res.status(500).json({ error: error });
  }
});

module.exports = {
  userRouter,
  isAuthenticated
};
