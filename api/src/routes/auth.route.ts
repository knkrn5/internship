import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post("/verify-email/", AuthController.findByEmail);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/user-data", AuthController.getUserData);

export { router as authRouter };