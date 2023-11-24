exports.getOverview = (req, res, next) => {
  res.status(200).render('overview', { title: 'All tours' }); // передаст в шаблон пропсы
};

exports.getTour = (req, res, next) => {
  res.status(200).render('tour', { title: 'The Forest Hiker Tour' }); // передаст в шаблон пропсы
};
