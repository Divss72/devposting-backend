export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  if (res.headersSent) return next(err);
  return res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
}
