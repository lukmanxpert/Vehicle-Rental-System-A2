import { Router } from "express";
import { vehiclesControllers } from "./vehicles.controller";
import auth from "../../middlewares/auth";

const router = Router();
router.post("/", auth("admin"), vehiclesControllers.postVehicles);

export const vehiclesRouter = router;
