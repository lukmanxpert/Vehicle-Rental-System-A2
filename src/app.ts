import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRouter } from "./modules/auth/auth.routes";
import { vehiclesRouter } from "./modules/vehicles/vehicles.routes";
import { usersRouter } from "./modules/users/users.routes";

const app = express();

// middlewares
app.use(express.json());

// initializing database
initDB();

// app home route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello world....",
  });
});

// all routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vehicles", vehiclesRouter);
app.use("/api/v1/users", usersRouter);

export default app;
