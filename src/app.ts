import express, { Request, Response } from "express";
import initDB from "./config/db";

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

// wrong route
app.use((req: Request, res: Response) => {
  res.json({
    message: "You entered a wrong route...",
  });
});

export default app;
