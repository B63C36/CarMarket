const express = require('express');
const router = express.Router();
const Car = require('../models/car');

//GET cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

//POST car
router.post('/', async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json({ message: 'Car listed', car });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;