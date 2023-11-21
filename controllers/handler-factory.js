const APIFeatures = require('../utils/api-features');
const AppError = require('../utils/app-error');
const handleAsync = require('../utils/handle-async');

exports.createOne = (model) =>
  handleAsync(async (req, res, next) => {
    const doc = await model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

exports.getOneById = (model, populateOptions) =>
  handleAsync(async (req, res, next) => {
    const { id } = req.params;

    let query = model.findById(id);
    if (populateOptions) query = query.populate(populateOptions);

    const doc = await query;

    if (!doc) {
      next(new AppError(`document with {_id : ${id}} - not found`, 404));
      return;
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.getAll = (model) =>
  handleAsync(async (req, res, next) => {
    const features = new APIFeatures(model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const data = await features.query;

    res.status(200).json({
      status: 'success',
      results: data.length,
      data,
    });
  });

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

exports.updateOneById = (model) =>
  handleAsync(async (req, res, next) => {
    const { id } = req.params;
    // удалим поле пароля , т.к. этот метод не должен обновлять никакие пароли
    if (req.body.password) delete req.body.password;

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
