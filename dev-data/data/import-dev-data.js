require('dotenv').config({ path: './config.env' });
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/tour-model');
const User = require('../../models/user-model');
const Review = require('../../models/review-model');

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection success...'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));

const createMany = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('save OK');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteAll = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('delete OK');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// process.argv - параметры, которые передаются при запуске файла так: --param
// node .\dev-data\data\import-dev-data.js --param  - в массиве process.argv будет значение --param
// console.log(process.argv)

if (process.argv[2] === '--delete') deleteAll();
if (process.argv[2] === '--import') createMany();
