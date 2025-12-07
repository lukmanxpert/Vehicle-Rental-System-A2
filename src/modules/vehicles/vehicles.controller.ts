import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";

const postVehicles = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;
  if (
    !vehicle_name ||
    !type ||
    !registration_number ||
    !daily_rent_price ||
    !availability_status
  ) {
    return res.status(400).json({
      message: "Provide required fields.",
      error: true,
      success: false,
    });
  }
  try {
    const result = await vehiclesService.postVehicles(req.body);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

export const vehiclesControllers = {
  postVehicles,
};
