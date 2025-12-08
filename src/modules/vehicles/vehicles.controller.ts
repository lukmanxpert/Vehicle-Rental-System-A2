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

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.getAllVehicles();
    if (!result.rows[0]) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: result.rows,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

const getSpecificVehicles = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId;
    const result = await vehiclesService.getSpecificVehicles(
      vehicleId as string
    );
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

const updateVehicles = async (req: Request, res: Response) => {
  const vehiclesId = req.params.vehicleId;
  if (!vehiclesId) {
    return res.status(400).json({
      message: "Provide vehicles id.",
      success: false,
      error: true,
    });
  }
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
      success: false,
      error: true,
    });
  }
  try {
    const result = await vehiclesService.updateVehicles(vehiclesId, req.body);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

export const vehiclesControllers = {
  postVehicles,
  getAllVehicles,
  getSpecificVehicles,
  updateVehicles,
};
