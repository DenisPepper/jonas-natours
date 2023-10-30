const getStub = (req, res) => {
    res.status(500).send('server error!');
  };
  
  exports.getAllUsers = (req, res) => {
    return getStub(req, res);
  };
  
  exports.createUser = (req, res) => {
    return getStub(req, res);
  };
  
  exports.getUsersById = (req, res) => {
    return getStub(req, res);
  };
  
  exports.updateUser = (req, res) => {
    return getStub(req, res);
  };
  
  exports.deleteUser = (req, res) => {
    return getStub(req, res);
  };
  