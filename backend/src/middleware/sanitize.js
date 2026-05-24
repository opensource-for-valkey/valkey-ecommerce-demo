import xss from "xss";

const cleanValue = (value) => {
  if (typeof value === "string") return xss(value.trim());
  if (Array.isArray(value)) return value.map(cleanValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, cleanValue(nested)])
    );
  }
  return value;
};

export const sanitizeInput = (req, _res, next) => {
  req.body = cleanValue(req.body || {});
  req.query = cleanValue(req.query || {});
  req.params = cleanValue(req.params || {});
  next();
};

