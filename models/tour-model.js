const mongoose = require('mongoose');
//const User = require('./user-model');
//const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [100, 'Tour name must be >= 100 chars'],
      minlength: [10, 'Tour name must be <= 10 chars'],
    },
    duration: { type: Number, required: [true, 'Tour must have a duration'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must have a difficulty'],
      enam: {
        values: ['easy', 'medium', 'hard'],
        message: 'Tour difficulty is only: easy, medium or hard',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, 'Tour rating must be <= 5'],
      min: [1, 'Tour rating must be >= 1'],
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'Tour must have a price'] },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // this - только при создании, не работает при обновлении
          return value < this.price;
        },
        message: 'Discount must be < price',
      },
    },
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
    isSecret: { type: Boolean, default: false },
    startLocaton: {
      // GeoJSON
      type: { type: String, default: 'Point', enum: ['Point'] },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        // GeoJSON
        type: { type: String, default: 'Point', enum: ['Point'] },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } },
);

// установит индексы полям:
// 1 - сортировка по возрастанию
// -1 - сортировка по убыванию
tourSchema.index({ price: 1, ratingsAverage: -1 }); // составной индекс
tourSchema.index({ slug: 1 });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
}); //виртуальное поле, которого не будет в БД, но будет в результате запроса

// виртуальное заполнение отзывов
// поскольку отзывы не хранятся в туре, для отзывов делаем виртуальное заполнение
tourSchema.virtual('reviews', {
  ref: 'Review', // имя модели для связывания
  foreignField: 'tour', // имя поля для связывания в модели Review
  localField: '_id', // имя поля для связывания в текущей модели - Tour
});

// SAVE NEW DOC MIDDLEWARE
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
}); 

// метод встраивает пользователей в документ тура
tourSchema.pre('save', async function (next) {
  // this - это документ, который сохраняется или создается
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});
*/

// QUERY MIDDLEWARE
/* eslint-disable prefer-arrow-callback */
/* tourSchema.pre(/^find/, function (next) {
  // this - это запрос, который выполняется
  this.find({ isSecret: { $ne: true } });
  next();
  this.customKey = Date.now();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`query time is: ${Date.now() - this.customKey} ms`);
  next();
}); */
tourSchema.pre(/^find/, function (next) {
  this.find({ isSecret: { $ne: true } });
  next();
});

// просит монго наполнить данные о гидах при любых запросах
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -role',
  });
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  // this - это агрегация
  // исключит секретные туры
  this.pipeline().unshift({ $match: { isSecret: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// trim: true - mongo будет тримить с обоих сторон строковые значения
// unique: true - mongo будет контролировать уникальность значений этого ключа
