import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          message: "Unauthorized access.",
          error: true,
          success: false,
        });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token as string,
        config.jwt_secret as string
      ) as JwtPayload;

      req.user = decoded;

      // If roles are provided, check role
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Forbidden access.",
          error: true,
          success: false,
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token.",
        error: true,
        success: false,
      });
    }
  };
};

export default auth;
