import { Router } from "express";
import auth from "../../middlewares/auth";
import { usersController } from "./users.controller";

const router = Router();

router.get("/", auth("admin"), usersController.getAllUsers);
router.put("/:userId", usersController.updateUsers);

export const usersRouter = router;
