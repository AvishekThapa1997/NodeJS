import { Request, Response, NextFunction } from "express";
import * as service from "../services/services";
import HttpException from "../util/HttpException";
export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // service
  //   .getTodos()
  //   .then((todos) => {})
  //   .catch((err) => {
  //     next(new HttpException());
  //   });
  try {
    const todos = await service.getTodos();
    res.status(200).send({
      data: todos,
    });
  } catch (err) {
    next(new HttpException());
  }
};
