import * as fs from "fs";
export const throwError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};
export const setDbError = (err) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
};

export const deleteImage = (imagePath) => {
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
};
export const imageTypes = ["image/jpg", "image/png", "image/jpeg"];

export const ITEM_PER_PAGE = 2;
