import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post("/verify-email/", AuthController.findByEmail);
router.post("/register", AuthController.register);

export { router as authRouter };