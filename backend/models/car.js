const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number, required: true },
  description: { type: String },
  contact: { type: String, required: true },
  images: [{ type: String }], //array of filesnames saved in the uploads folder
  userId: { type: String }, //id of the user who posted the listing. for delete permission
  createdAt: { type: Date, default: Date.now } //sets date and time to current date and time posted
});

module.exports = mongoose.model('Car', carSchema);