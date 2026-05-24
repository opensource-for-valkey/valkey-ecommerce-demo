import { logger } from "../config/logger.js";

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      message: `Route ${req.method} ${req.originalUrl} was not found`,
      status: 404
    }
  });
};

export const errorHandler = (err, req, res, _next) => {
  const status = err.status || 500;

  if (status >= 500) {
    logger.error(err.message, {
      stack: err.stack,
      method: req.method,
      url: req.originalUrl
    });
  }

  res.status(status).json({
    error: {
      message: status >= 500 ? "Internal server error" : err.message,
      status,
      details: err.details
    }
  });
};

