import jwt from "jsonwebtoken";
import { config } from "../config/config";

const JWT_SECRET = config.jwt.ACCESS_TOKEN_SECRET as string;
const JWT_REFRESH_SECRET = config.jwt.REFRESH_TOKEN_SECRET as string;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets are not defined in environment variables");
}

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};
