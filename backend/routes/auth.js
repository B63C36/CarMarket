const express = require('express');
const router = express.Router(); //lets us define routes sepaertly from server.js
const bcrypt = require('bcryptjs'); //bcrypt is used to hash passwords befroe saving
const jwt = require('jsonwebtoken'); //jwt creats tokens used to keep users logged in
const User = require('../models/User'); //import the users model to work with mongodb

// to register new user
router.post('/register', async (req, res) => {
  try {
    //get name from the request body
    const { name, email, password } = req.body; 
  
    // check to see if email already registered
    const existing = await User.findOne({ email }); 
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    //hashes password with bcrypt before saving - 10 is the salt rounds on how storg the hash is
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    //create new user and save to mongodb
    res.json({ message: 'Account created' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// to login checks email and password and returns jwt 
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    //looks for user in mongodb by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    //compares password with stored hash
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid email or password' });

    //creats jwt containg user id - expires after 1 day
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    //sends token, name and userid to the frontend to store in local storage
    res.json({ token, name: user.name, userId: user._id.toString() });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;