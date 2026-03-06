/**
 * Central error handling middleware.
 * Sends consistent API error responses and proper HTTP status codes.
 */
function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';
  const code = err.code || 'INTERNAL_ERROR';

  if (req.app.get('env') === 'development') {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    error: {
      code,
      message,
      ...(req.app.get('env') === 'development' && err.stack && { stack: err.stack }),
    },
  });
}

module.exports = errorHandler;
