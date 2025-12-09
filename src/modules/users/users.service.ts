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
  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE id = $1
      `,
      [userId]
    );
    const user = result.rows[0];
    if (!req.user) {
      return {
        message: "Please login first.",
        error: true,
        success: false,
      };
    }
    if (req.user.id !== user.id) {
      return {
        message: "Forbidden access.",
        error: true,
        success: false,
      };
    }
    if (req.user.id === user.id || req.user.role === "admin") {
      pool.query(`
          
        `);
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
