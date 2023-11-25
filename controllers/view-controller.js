const Tour = require('../models/tour-model');
const handleAsync = require('../utils/handle-async');

exports.getOverview = handleAsync(async (req, res, next) => {
  // запрос туров из БД
  const tours = await Tour.find();

  res.status(200).render('overview', { title: 'All tours', tours }); // передаст в шаблон пропсы
});

exports.getTour = handleAsync(async (req, res, next) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  res.status(200).render('tour', { title: tour.name, tour }); // передаст в шаблон пропсы
});
