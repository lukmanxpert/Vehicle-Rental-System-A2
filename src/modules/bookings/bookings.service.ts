import { start } from "repl";
import { pool } from "../../config/db";
import { Request } from "express";

const createBookings = async (req: Request) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
  try {
    const getVehicle = await pool.query(
      `
        SELECT * FROM vehicles WHERE id = $1
      `,
      [vehicle_id]
    );
    if (getVehicle.rowCount === 0) {
      return [
        404,
        {
          message: "No Vehicles found in this id.",
          error: true,
          success: false,
        },
      ];
    }
    const vehicle = getVehicle.rows[0];

    console.log("vehicle :>> ", vehicle);

    if (vehicle.availability_status === "booked") {
      return [
        200,
        {
          message: "Vehicle already booked.",
          success: true,
          error: false,
        },
      ];
    }

    if (vehicle.availability_status === "available") {
      const start = new Date(rent_start_date);
      const end = new Date(rent_end_date);

      const diffTime = end.getTime() - start.getTime();
      const rentDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const totalRentPrice = vehicle.daily_rent_price * rentDays;

      const result = await pool.query(
        `
        INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
      `,
        [
          customer_id,
          vehicle_id,
          rent_start_date,
          rent_end_date,
          totalRentPrice,
          "active",
        ]
      );
      if (result.rowCount === 0) {
        return [
          500,
          {
            message: "Something went wrong, try again later.",
            error: true,
            success: false,
          },
        ];
      }
      const booking = result.rows[0];
      const setVehicleBooked = await pool.query(
        `
        UPDATE vehicles SET availability_status = $1 WHERE id = $2
        `,
        ["booked", vehicle_id]
      );
      return [
        201,
        {
          success: true,
          message: "Booking created successfully",
          data: {
            id: booking.id,
            customer_id: booking.customer_id,
            vehicle_id: booking.vehicle_id,
            rent_start_date: booking.rent_start_date,
            rent_end_date: booking.rent_end_date,
            total_price: booking.total_price,
            status: booking.status,
            vehicle: {
              vehicle_name: vehicle.vehicle_name,
              daily_rent_price: vehicle.daily_rent_price,
            },
          },
        },
      ];
    } else {
      return [
        400,
        {
          message: "Invalid vehicle availability status.",
          error: true,
          success: false,
        },
      ];
    }
  } catch (error: any) {
    return [
      500,
      {
        message: error.message,
        error: true,
        success: false,
      },
    ];
  }
};

export const bookingsService = {
  createBookings,
};
