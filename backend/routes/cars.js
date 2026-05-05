const express = require('express');
const router = express.Router();

// Placeholder - we'll build this out on Day 4
router.get('/test', (req, res) => {
  res.json({ message: 'Cars route working' });
});

module.exports = router;
