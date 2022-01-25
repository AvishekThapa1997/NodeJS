import HttpException from "../util/HttpException";
import { Request, Response, NextFunction } from "express";
const errorMiddleware = (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.status(error.status).send({
    message: error.message,
  });
};
export default errorMiddleware;
