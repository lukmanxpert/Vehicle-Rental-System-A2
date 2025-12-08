import { Router } from "express";
import { vehiclesControllers } from "./vehicles.controller";
import auth from "../../middlewares/auth";

const router = Router();
router.post("/", auth("admin"), vehiclesControllers.postVehicles);
router.get("/", vehiclesControllers.getAllVehicles);
router.get("/:vehicleId", vehiclesControllers.getSpecificVehicles);
router.put("/:vehicleId", auth("admin"), vehiclesControllers.updateVehicles);
router.delete("/:vehicleId", auth("admin"), vehiclesControllers.deleteVehicles);

export const vehiclesRouter = router;
