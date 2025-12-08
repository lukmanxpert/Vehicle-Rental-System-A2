import { pool } from "../../config/db";

const postVehicles = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  try {
    const result = await pool.query(
      `
            INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *
        `,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
      ]
    );
    if (result.rowCount === 0) {
      return {
        message: "Posted failed, try again.",
        error: true,
        success: false,
      };
    }
    const vehicle = result.rows[0];
    return {
      success: true,
      message: "Vehicle created successfully",
      data: {
        id: vehicle.id,
        vehicle_name: vehicle.vehicle_name,
        type: vehicle.type,
        registration_number: vehicle.registration_number,
        daily_rent_price: vehicle.daily_rent_price,
        availability_status: vehicle.availability_status,
      },
    };
  } catch (error: any) {
    return {
      message: error.message,
      error: true,
      success: false,
    };
  }
};

const getAllVehicles = async () => {
  const result = await pool.query(`
      SELECT * FROM vehicles
    `);
  return result;
};

const getSpecificVehicles = async (vehicleId: string) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM vehicles WHERE id = $1
      `,
      [vehicleId]
    );
    console.log("vehicleId :>> ", vehicleId);
    if (!result.rows[0]) {
      return {
        success: true,
        message: "No vehicles found",
        data: result.rows,
      };
    }
    return {
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows,
    };
  } catch (error: any) {
    return {
      message: error.message,
      error: true,
      success: false,
    };
  }
};

const updateVehicles = async (
  vehicleId: string,
  obj: Record<string, unknown>
) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = obj;
  try {
    const result = await pool.query(
      `
        UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *
      `,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
        vehicleId,
      ]
    );
    if (result.rowCount === 0) {
      return {
        message: "Vehicles not found.",
        error: true,
        success: false,
      };
    }
    const vehicles = result.rows[0];
    return {
      success: true,
      message: "Vehicle updated successfully",
      data: {
        id: vehicles.id,
        vehicle_name: vehicles.vehicle_name,
        type: vehicles.type,
        registration_number: vehicles.registration_number,
        daily_rent_price: vehicles.daily_rent_price,
        availability_status: vehicles.availability_status,
      },
    };
  } catch (error: any) {
    return {
      message: error.message,
      success: false,
      error: true,
    };
  }
};

const deleteVehicles = async (vehicleId: string) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM vehicles WHERE id = $1
      `,
      [vehicleId]
    );
    console.log("result :>> ", result);
    if (result.rowCount === 0) {
      return {
        message: "Vehicles not found.",
        error: true,
        success: false,
      };
    }
    return {
      success: true,
      message: "Vehicle deleted successfully",
    };
  } catch (error: any) {
    return {
      message: error.message,
      error: true,
      success: false,
    };
  }
};

export const vehiclesService = {
  postVehicles,
  getAllVehicles,
  getSpecificVehicles,
  updateVehicles,
  deleteVehicles,
};
