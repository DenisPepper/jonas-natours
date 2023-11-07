const mongoose = require('mongoose');
//const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
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
    createdAt: { type: Date, default: Date.now(), select: false },
    startDates: [Date],
    slug: String,
  },
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
}); //виртуальное поле, которого не будет в БД, но будет в результате запроса

/* // подписка на событие перед save() и create()
tourSchema.pre('save', function (next) {
  // this - это документ, который сохраняется
  this.slug = slugify(this.name, { lower: true });
  next();
});

// подписка на событие после save() и create()
tourSchema.pre('save', function (doc, next) {
  this.slug = slugify(this.name, { lower: true });
  next();
}); */

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// trim: true - mongo будет тримить с обоих сторон строковые значения
// unique: true - mongo будет контролировать уникальность значений этого ключа
