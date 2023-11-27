const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      error: err,
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
    return;
  }

  // RENDERED PAGES
  res
    .status(err.statusCode)
    .render('error', { title: 'Somthing went wrong...', msg: err.message });
};

const sendError = (err, req, res) => {
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

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);

  if (process.env.NODE_ENV === 'production') sendError(err, req, res);

  next();
};

module.exports = globalErrorHandler;
