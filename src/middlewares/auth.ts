import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "You're not allowed.",
        error: true,
        success: false,
      });
    }
    const decoded = jwt.verify(
      token,
      config.jwt_secret as string
    ) as JwtPayload;
    req.user = decoded;
    if (req.user.role === role) {
      next();
    } else {
      return res.status(403).json({
        message: "Forbidden access.",
        error: true,
        success: false,
      });
    }
  };
};

export default auth;
