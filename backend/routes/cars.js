const express = require('express');
const router = express.Router();
const multer = require('multer'); //manages image file uploads
const path = require('path'); //builds file directory paths   
const fs = require('fs'); //allows to delete files from the server
const jwt = require('jsonwebtoken'); //jwt used to verify loggen in user  
const Car = require('../models/Car'); //import the car model 

//multer tell it where to save files and what to name them
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); //save all uploades images to the uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); //adds timestamp to avoid duplicate file names
  }
});

const upload = multer({ storage: storage }); // creates new upload handler

//get all cars - from mongodb newest to oldest 
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

//post a new car listing - requires valid jwt 
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    //get the token from the request header
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const carData = req.body;
    carData.userId = decoded.id; //save user id with the listing 

    //if images uploaded save their filenames to the car data
    if (req.files && req.files.length > 0) {
      carData.images = req.files.map(file => file.filename);
    }

    //create and save the new car listing
    const car = new Car(carData);
    await car.save();
    res.status(201).json({ message: 'Car listed successfully', car });
  } catch (err) {
    res.status(400).json({ error: 'You must be logged in to post a car' });
  }
});

//delete a car - only the user who uploaded can delete
router.delete('/:id', async (req, res) => {
  try {
    //verify the jwt to get the logged in user
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //frind car in mongodb
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });

    //check the person deleting is the same who posted it
    if (car.userId !== decoded.id) {
      return res.status(403).json({ error: 'You can only delete your own listings' });
    }

    //delete the image files from the uploads folder
    if (car.images && car.images.length > 0) {
      car.images.forEach(image => {
        const filePath = path.join(__dirname, '../uploads', image);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath); //only deletes if files exists
      });
    }

    //remove lisitng from mongodb
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single car by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;