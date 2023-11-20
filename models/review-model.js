const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can`t be empty!'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review can`t be without ref to user!'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review can`t be without ref to tour!'],
    },
    rating: {
      type: Number,
      max: [5, 'Tour rating must be <= 5'],
      min: [1, 'Tour rating must be >= 1'],
    },
    createdAt: { type: Date, default: Date.now() },
  },
  // включает виртуальные свойства
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } },
);

// middlewares
// просит монго сделать вложенные запросы
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
