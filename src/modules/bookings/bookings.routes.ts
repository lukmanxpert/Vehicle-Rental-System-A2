import { Router } from "express";
import { bookingsController } from "./bookings.controller";

const router = Router();

router.post("/", bookingsController.createBookings);

export const bookingsRouter = router;
