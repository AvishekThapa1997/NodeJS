exports.separateValidationError = (validationErrors) => {
  const validationErrorsObj = {};
  validationErrors.forEach((error) => {
    validationErrorsObj[error.param] = error.msg;
  });
  return validationErrorsObj;
};
