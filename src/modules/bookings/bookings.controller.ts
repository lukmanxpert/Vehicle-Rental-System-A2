import { Request, Response } from "express";
import { bookingsService } from "./bookings.service";
import { JwtPayload } from "jsonwebtoken";

const createBookings = async (req: Request, res: Response) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    return res.status(400).json({
      message: "Provide all required fields.",
      error: true,
      success: false,
    });
  }
  const user = req.user as JwtPayload;
  if (customer_id !== user.id) {
    return res.status(401).json({
      message: "Unauthorize access.",
      error: true,
      success: false,
    });
  }
  try {
    const result = await bookingsService.createBookings(req);
    return res.status(result[0] as number).json(result[1]);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    const result = await bookingsService.getBookings(user.id, user.role);
    return res.status(result[0] as number).json(result[1]);
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
  getBookings,
};
