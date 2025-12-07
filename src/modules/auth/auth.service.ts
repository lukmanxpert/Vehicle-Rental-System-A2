import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signupUser = async (...payload: string[]) => {
  const [name, email, password, phone, role] = payload;
  const hashedPassword = await bcrypt.hash(password as string, 10);
  try {
    const result = pool.query(
      `
        INSERT INTO users(name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role
        `,
      [name, email, hashedPassword, phone, role]
    );
    return result;
  } catch (error) {
    return null;
  }
};

const signinUser = async (email: string, password: string) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE email =  $1
      `,
      [email]
    );
    if (result.rowCount === 0) {
      return { message: "Invalid credential", success: false, error: true };
    }
    const matched = await bcrypt.compare(password, result.rows[0].password);
    if (!matched) {
      return { message: "Wrong password", error: true, success: false };
    }
    const user = result.rows[0];
    const token = jwt.sign(user, config.jwt_secret as string, {
      expiresIn: "7d",
    });
    return {
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    };
  } catch (error: any) {
    return { message: error.message, success: false, error: true };
  }
};

export const authService = {
  signupUser,
  signinUser,
};
