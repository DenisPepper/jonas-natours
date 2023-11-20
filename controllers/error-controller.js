const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    error: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendError = (err, res) => {
  // unknow programming error
  if (!err.isOperational) {
    console.error('unknow programming error!🐸', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
    return;
  }

  //trusted operational app error
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);

  if (process.env.NODE_ENV === 'production') sendError(err, res);

  next();
};

module.exports = globalErrorHandler;