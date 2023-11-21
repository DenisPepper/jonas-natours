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

exports.udateOneById = (model) =>
  handleAsync(async (req, res, next) => {
    const { id } = req.params;

    const doc = await model.findByIdAndUpdate(id, req.body, {
      new: true, // new: true - вернет обновленный документ, а не оригинал
      runValidators: true, // включет валидацию при обновлении документа
    });

    if (!doc) {
      next(new AppError(`document with {_id : ${id}} - not found`, 404));
      return;
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });
