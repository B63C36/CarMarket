const express = require('express');
const router = express.Router();

// Placeholder - we'll build this out on Day 3
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working' });
});

module.exports = router;