import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../enums/HttpStatusCode"; 

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;

  console.error('Error', error.message);

  res.status(statusCode).json({
    success: false,
    message: error.message || 'An unexpected error occurred'
  });
};