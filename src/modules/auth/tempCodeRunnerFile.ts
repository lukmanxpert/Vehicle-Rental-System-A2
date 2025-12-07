import { Router } from "express";

const router = Router();

router.get("/signup", (req, res) => {
    res.send("working fine")
})

export const authRouter = router;
