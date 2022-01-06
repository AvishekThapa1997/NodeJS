exports.showError = (next, err) => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  next(error);
};
