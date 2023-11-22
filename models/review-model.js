const mongoose = require('mongoose');
const Tour = require('./tour-model');

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
      required: [true, 'Review can`t be without rating!'],
    },
    createdAt: { type: Date, default: Date.now() },
  },
  // включает виртуальные свойства
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } },
);

// Static model methods
// статический метод модели по расчету среднего рейтинга
reviewSchema.statics.calcAverageRatings = async function (tourID) {
  // this - модель
  // statas - результат запроса, который
  // выбирает отзывы по ID тура
  // группирует результат по ID тура, вычисляя:
  // поле nRating - как сумму всех найденных документов в выборке (отзывов)
  // поле avgRating - как среднее значение полей 'rating'
  const stats = await this.aggregate([
    {
      $match: { tour: tourID },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  // находит тур по ID и обновляет новыми данными
  await Tour.findByIdAndUpdate(tourID, {
    ratingsAverage: stats[0].avgRating,
    ratingsQuantity: stats[0].nRating,
  });
};

// middlewares
// просит монго сделать вложенные запросы
reviewSchema.pre(/^find/, function (next) {
  /* this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name',
  });
 */
  this.populate({
    path: 'user',
    select: 'name',
  });

  next();
});

// после сохранения отзыва (post save) в БД, модель вызовет функцию расчета среднего рейтинга
reviewSchema.post('save', function () {
  // this - ткущий документ
  this.constructor.calcAverageRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
