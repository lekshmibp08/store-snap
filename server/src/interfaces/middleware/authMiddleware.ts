import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { HttpStatusCode } from "../../enums/HttpStatusCode";
import { config } from "../../config/config";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  console.log("token: ", token);

  if (!token) throw {
    statusCode: HttpStatusCode.UNAUTHORIZED,
    message: "Access denied. No token provided." 
  }

  try {
    const decoded = jwt.verify(token, config.jwt.ACCESS_TOKEN_SECRET) as any
    console.log("Decoded: ", decoded);
    
    req.user = decoded
    console.log(req.user);
    
    next()
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw {
        statusCode: HttpStatusCode.UNAUTHORIZED,
         message: "Token expired, please login again.",
      }
    }
    if (err instanceof JsonWebTokenError) {
      throw {
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: "Invalid token."
      }
    }
    next(err)
  }
}