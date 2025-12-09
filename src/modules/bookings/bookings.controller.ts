import { Request, Response } from "express";
const createBookings = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

export const bookingsController = {
  createBookings,
};
