import { Request, Response } from "express";
import { usersService } from "./users.service";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersService.getAllUsers();
    res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

const updateUsers = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({
      message: "User Id not found.",
      error: true,
      success: false,
    });
  }
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "You need to be login first.",
      error: true,
      success: false,
    });
  }
  const decode = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
  req.user = decode;
  try {
    const result = await usersService.updateUsers(req, userId);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

export const usersController = {
  getAllUsers,
  updateUsers,
};
