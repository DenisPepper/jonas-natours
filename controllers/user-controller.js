const getStub = (req, res) => {
  res.status(500).send('server error!');
};

exports.getAllUsers = (req, res) => getStub(req, res);

exports.createUser = (req, res) => getStub(req, res);

exports.getUsersById = (req, res) => getStub(req, res);

exports.updateUser = (req, res) => getStub(req, res);

exports.deleteUser = (req, res) => getStub(req, res);
