export function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  const isMalformedJson = error instanceof SyntaxError && error.status === 400 && "body" in error;
  const status = isMalformedJson ? 400 : Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) console.error(error);
  const body = {
    message: isMalformedJson
      ? "Request body contains invalid JSON."
      : status >= 500
        ? "Something went wrong. Please try again."
        : error.message,
  };
  if (error.errors) body.errors = error.errors;
  res.status(status).json(body);
}
