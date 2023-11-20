require('dotenv').config({ path: './config.env' });
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/tour-model');

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection success...'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));

const createMany = async () => {
  try {
    await Tour.create(tours);
    console.log('save OK');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteAll = async () => {
  try {
    await Tour.deleteMany();
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
