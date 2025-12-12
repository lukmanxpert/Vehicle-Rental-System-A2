import { Router } from "express";
import { bookingsController } from "./bookings.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/", auth("admin", "customer"), bookingsController.createBookings);
router.get("/", auth("admin", "customer"), bookingsController.getBookings);

export const bookingsRouter = router;
