import HttpException from "./HttpException";
const generateError = (message?: string, statusCode?: number) => {
  if (message && statusCode) {
    throw new HttpException(statusCode, message);
  }
  throw new HttpException();
};
export default generateError;
