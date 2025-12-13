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

const getBookings = async (customer_id: string, role: string) => {
  try {
    let query = "";
    let values: any[] = [];

    if (role === "customer") {
      query = `
        SELECT
          b.id,
          b.vehicle_id,
          b.rent_start_date,
          b.rent_end_date,
          b.total_price,
          b.status,

          v.vehicle_name,
          v.registration_number,
          v.type

        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.customer_id = $1
        ORDER BY b.id DESC
      `;
      values = [customer_id];
    }

    if (role === "admin") {
      query = `
        SELECT
          b.id,
          b.customer_id,
          b.vehicle_id,
          b.rent_start_date,
          b.rent_end_date,
          b.total_price,
          b.status,

          u.name AS customer_name,
          u.email AS customer_email,

          v.vehicle_name,
          v.registration_number

        FROM bookings b
        JOIN users u ON b.customer_id = u.id
        JOIN vehicles v ON b.vehicle_id = v.id
        ORDER BY b.id DESC
      `;
    }

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return [
        404,
        {
          success: true,
          error: false,
          message:
            role === "admin"
              ? "No bookings found."
              : "You do not have any bookings.",
        },
      ];
    }

    // 🔹 FORMAT BASED ON ROLE
    const formattedBookings =
      role === "admin"
        ? result.rows.map((row) => ({
            id: row.id,
            customer_id: row.customer_id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            customer: {
              name: row.customer_name,
              email: row.customer_email,
            },
            vehicle: {
              vehicle_name: row.vehicle_name,
              registration_number: row.registration_number,
            },
          }))
        : result.rows.map((row) => ({
            id: row.id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            vehicle: {
              vehicle_name: row.vehicle_name,
              registration_number: row.registration_number,
              type: row.type,
            },
          }));

    return [
      200,
      {
        success: true,
        message:
          role === "admin"
            ? "Bookings retrieved successfully"
            : "Your bookings retrieved successfully",
        data: formattedBookings,
      },
    ];
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

const updateBookings = async (req: Request) => {
  const user = req.user as any;
  const bookingId = req.params.bookingId;
  const { status } = req.body;

  try {
    const bookingResult = await pool.query(
      `
      SELECT * FROM bookings WHERE id = $1
      `,
      [bookingId]
    );

    if (bookingResult.rowCount === 0) {
      return [
        404,
        {
          message: "Booking not found",
          error: true,
          success: false,
        },
      ];
    }

    const booking = bookingResult.rows[0];

    // CUSTOMER LOGIC
    if (user.role === "customer") {
      if (booking.customer_id !== user.id) {
        return [
          403,
          {
            message: "You are not allowed to update this booking",
            error: true,
            success: false,
          },
        ];
      }

      if (status !== "cancelled") {
        return [
          400,
          {
            message: "Customer can only cancel booking",
            error: true,
            success: false,
          },
        ];
      }

      const today = new Date();
      const startDate = new Date(booking.rent_start_date);

      if (today >= startDate) {
        return [
          400,
          {
            message: "Booking can only be cancelled before start date",
            error: true,
            success: false,
          },
        ];
      }

      const updateResult = await pool.query(
        `
        UPDATE bookings
        SET status = 'cancelled'
        WHERE id = $1
        RETURNING *
        `,
        [bookingId]
      );

      await pool.query(
        `
        UPDATE vehicles
        SET availability_status = 'available'
        WHERE id = $1
        `,
        [booking.vehicle_id]
      );

      return [
        200,
        {
          success: true,
          message: "Booking cancelled successfully",
          data: updateResult.rows[0],
        },
      ];
    }

    // ADMIN LOGIC
    if (user.role === "admin") {
      if (status !== "returned") {
        return [
          400,
          {
            message: "Admin can only mark booking as returned",
            error: true,
            success: false,
          },
        ];
      }

      const updateResult = await pool.query(
        `
        UPDATE bookings
        SET status = 'returned'
        WHERE id = $1
        RETURNING *
        `,
        [bookingId]
      );

      const vehicleResult = await pool.query(
        `
        UPDATE vehicles
        SET availability_status = 'available'
        WHERE id = $1
        RETURNING availability_status
        `,
        [booking.vehicle_id]
      );

      return [
        200,
        {
          success: true,
          message: "Booking marked as returned. Vehicle is now available",
          data: {
            ...updateResult.rows[0],
            vehicle: {
              availability_status: vehicleResult.rows[0].availability_status,
            },
          },
        },
      ];
    }

    // FALLBACK
    return [
      403,
      {
        message: "Unauthorized role",
        error: true,
        success: false,
      },
    ];
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
  getBookings,
  updateBookings,
};
