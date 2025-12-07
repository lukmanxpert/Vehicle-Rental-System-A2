import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRouter } from "./modules/auth/auth.routes";
import { vehiclesRouter } from "./modules/vehicles/vehicles.routes";

const app = express();

// middlewares
app.use(express.json());

// initializing database
initDB();

// all routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vehicles", vehiclesRouter);

// app home route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello world....",
  });
});

// wrong route
app.use((req: Request, res: Response) => {
  res.json({
    message: "You entered a wrong route...",
  });
});

export default app;
