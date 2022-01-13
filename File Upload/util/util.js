const e = require("connect-flash");
const fs = require("fs");
exports.separateValidationError = (validationErrors) => {
  const validationErrorsObj = {};
  validationErrors.forEach((error) => {
    validationErrorsObj[error.param] = error.msg;
  });
  return validationErrorsObj;
};
exports.deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
};
exports.imageTypes = ["image/jpg", "image/png", "image/jpeg"];
exports.itemPerPage = 2;
