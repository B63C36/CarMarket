// Package Import
const express = require('express'); 
const mongoose = require('mongoose'); //connet to mongoDB
const cors = require('cors'); //frontend talk to backend
const path = require('path'); //helps build file dir paths
require('dotenv').config(); //loads key from .env

const app = express();

app.use(cors()); 
app.use(express.json()); //server read JSON data
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); //uploads images as static files

//connect to mongodb atlas using connection string from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('DB Error:', err));

app.use('/api/auth', require('./routes/auth')); //login and register routes
app.use('/api/cars', require('./routes/cars')); //car lisitings
app.use('/api/valuate', require('./routes/valuate')); // ai valuation

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});