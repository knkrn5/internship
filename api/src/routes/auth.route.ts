import { Router } from "express";

import { AuthController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/verify-email/", AuthController.findByEmail);
router.post("/send-email-otp", AuthController.sendEmailOtp);
router.post("/verify-email-otp", AuthController.verifyEmailOtp);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/user-data", AuthController.getUserData);
router.post("/logout", AuthController.logout);


export { router as authRouter };