const handleAsync = (handler) => (req, res, next) =>
  handler(req, res).catch((error) => next(error));

module.exports = handleAsync;
