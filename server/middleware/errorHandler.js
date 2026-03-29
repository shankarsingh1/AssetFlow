export function errorHandler(err, req, res, _next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  } else {
    console.error(message);
  }

  res.status(status).json({
    message: status === 500 ? 'Internal server error' : message,
    ...(err.details && typeof err.details === 'object' ? err.details : {}),
  });
}
