const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name'],
    unique: true,
    trim: true,
  },
  duration: { type: Number, required: [true, 'Tour must have a duration'] },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'Tour must have a difficulty'],
  },
  ratingsAverage: { type: Number, default: 4.5 },
  ratingsQuantity: { type: Number, default: 0 },
  price: { type: Number, required: [true, 'Tour must have a price'] },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'Tour must have a summery'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Tour must have a description'],
  },
  imageCover: {
    type: String,
    required: [true, 'Tour must have an image cover'],
  },
  images: [String],
  createdAt: { type: Date, default: Date.now() },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// trim: true - mongo будет тримить с обоих сторон строковые значения
// unique: true - mongo будет контролировать уникальность значений этого ключа
