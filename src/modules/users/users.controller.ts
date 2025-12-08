import { Request, Response } from "express";
import { usersService } from "./users.service";

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

export const usersController = {
  getAllUsers,
};
