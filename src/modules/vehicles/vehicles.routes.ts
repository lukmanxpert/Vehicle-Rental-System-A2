import { Router } from "express";
import { vehiclesControllers } from "./vehicles.controller";
import auth from "../../middlewares/auth";

const router = Router();
router.post("/", auth("admin"), vehiclesControllers.postVehicles);
router.get("/", vehiclesControllers.getAllVehicles);

export const vehiclesRouter = router;
