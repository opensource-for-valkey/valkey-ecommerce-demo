const format = (level, message, meta = {}) => {
  const payload = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}${payload}`;
};

export const logger = {
  info(message, meta) {
    console.log(format("info", message, meta));
  },
  warn(message, meta) {
    console.warn(format("warn", message, meta));
  },
  error(message, meta) {
    console.error(format("error", message, meta));
  }
};

