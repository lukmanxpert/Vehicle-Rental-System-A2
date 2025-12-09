import { pool } from "../../config/db";
import { Request } from "express";

const getAllUsers = async () => {
  try {
    const result = await pool.query(`
            SELECT * FROM users
        `);
    if (result.rowCount === 0) {
      return {
        message: "No users registered.",
        success: true,
        error: false,
      };
    }
    return {
      success: true,
      message: "Users retrieved successfully",
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

const updateUsers = async (req: Request, userId: string) => {
  const { name, email, phone, role } = req.body;
  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE id = $1 
      `,
      [userId]
    );
    console.log("result :>> ", result);
    if (result.rowCount === 0) {
      return {
        message: "User not found, provide a valid user id.",
        error: true,
        success: false,
      };
    }
    const user = result.rows[0];
    if (!req.user?.id) {
      return {
        message: "Please login first.",
        error: true,
        success: false,
      };
    }
    if (req.user.id !== user?.id && req.user.role !== "admin") {
      return {
        message: "Forbidden access.",
        error: true,
        success: false,
      };
    }
    if (req.user.id === user.id || req.user.role === "admin") {
      const result = await pool.query(
        `
          UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING *
        `,
        [name, email, phone, role, userId]
      );
      if (result.rowCount === 0) {
        return {
          message: "Something went wrong, try again.",
          error: true,
          success: false,
        };
      } else {
        return {
          success: true,
          message: "User updated successfully",
          data: result.rows[0],
        };
      }
    }
  } catch (error: any) {
    return {
      message: error.message,
      error: true,
      success: false,
    };
  }
};

export const usersService = {
  getAllUsers,
  updateUsers,
};
