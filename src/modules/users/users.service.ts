import { pool } from "../../config/db";

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

export const usersService = {
  getAllUsers,
};
