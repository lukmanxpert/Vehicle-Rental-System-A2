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

export const vehiclesService = {
  postVehicles,
  getAllVehicles,
};
