const Tour = require('../models/tour-model');
const handleAsync = require('../utils/handle-async');

exports.getOverview = handleAsync(async (req, res, next) => {
  // запрос туров из БД
  const tours = await Tour.find();

  res.status(200).render('overview', { title: 'All tours', tours }); // передаст в шаблон пропсы
});

exports.getTour = (req, res, next) => {
  res.status(200).render('tour', { title: 'The Forest Hiker Tour' }); // передаст в шаблон пропсы
};
