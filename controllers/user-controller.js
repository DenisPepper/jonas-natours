const getStub = (req, res) => {
  res.status(500).send('server error!');
};

exports.getAllUsers = (req, res, next) => getStub(req, res);

exports.createUser = (req, res, next) => getStub(req, res);

exports.getUsersById = (req, res, next) => getStub(req, res);

exports.updateUser = (req, res, next) => getStub(req, res);

exports.deleteUser = (req, res, next) => getStub(req, res);
