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
    ratingsAverage: stats[0]?.avgRating || 0, //установит 0, если удалят последний отзыв
    ratingsQuantity: stats[0]?.nRating || 0, //установит 0, если удалят последний отзыв
  });
};

// установит составной индекс: тур + пользователь, с признаком уникальности
// БД выдаст ошибку, если один и тотже пользователь решить оставить второй отзыв на один и тотже тур
// один пользователь -> только один отзыв
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

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
    select: 'name photo',
  });

  next();
});

// после сохранения отзыва (post save) в БД, модель вызовет функцию расчета среднего рейтинга
reviewSchema.post('save', function () {
  // this - ткущий документ
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate - тоже нужно пересчитывать рейтинг тура, если в отзыве изменили рейтинг
// findByIdAndDelete - тоже нужно пересчитатб рейтинг тура, т.к. отзыва с рейтингом больше нет
//
// перед выполнением запроса
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // this - текущий запрос

  // выполняем запрос и получаем документ - отзыв
  // записав его в свойство объекта запроса
  this.review = await this.findOne();
  next();
});

// после выполнения запроса
reviewSchema.post(/^findOneAnd/, function () {
  // this - текущий запрос

  // извлекаем id тура из свойства review запроса
  // это свойство было создано на стадии reviewSchema.pre(/^findOneAnd/
  const { tour: tourID } = this.review;

  // вызовет статический метод модели Review для расчета среднего ретийнга
  this.review.constructor.calcAverageRatings(tourID);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
