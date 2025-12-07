import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

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

export const authService = {
  signupUser,
};
