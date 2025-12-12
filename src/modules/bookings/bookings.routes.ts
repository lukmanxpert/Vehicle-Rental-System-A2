import { Router } from "express";
import { bookingsController } from "./bookings.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/", auth("admin", "customer"), bookingsController.createBookings);

export const bookingsRouter = router;
