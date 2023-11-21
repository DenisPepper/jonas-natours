const AppError = require('../utils/app-error');
const handleAsync = require('../utils/handle-async');

exports.deleteOneById = (model) =>
  handleAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await model.findByIdAndDelete(id);

    if (!doc) {
      next(new AppError(`document with {_id : ${id}} - not found`, 404));
      return;
    }

    res.status(204).send();
  });
