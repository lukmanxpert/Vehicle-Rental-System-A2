import { Request, Response } from "express";
import { authService } from "./auth.service";

const signupUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req?.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({
      message: "Provide all required fields.",
      success: false,
      error: true,
    });
  }
  try {
    const result = await authService.signupUser(
      name,
      email,
      password,
      phone,
      role
    );
    if (result?.rows[0]) {
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(500).json({
        message: "User not created, something went wrong.",
        error: true,
        success: false,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

const signinUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Provide required field.",
      error: true,
      success: false,
    });
  }
  try {
    const result = await authService.signinUser(email, password);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

export const authController = {
  signupUser,
  signinUser,
};
