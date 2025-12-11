import { Request, Response } from "express";
import { bookingsService } from "./bookings.service";
const createBookings = async (req: Request, res: Response) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    return res.status(400).json({
      message: "Provide all required fields.",
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

export const bookingsController = {
  createBookings,
};
