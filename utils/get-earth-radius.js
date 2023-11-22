const getEarthRadius = (distance, unit) => {
  if (!distance || (unit !== 'km' && unit !== 'mi')) return;
  return unit === 'km' ? distance / 6378.1 : distance / 3963.2;
};

module.exports = getEarthRadius;
