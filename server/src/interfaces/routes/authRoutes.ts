import express from "express";
import { 
    sendOtp,
    verifyOtpAndRegisterUser,
    userLogin,
    forgotPassword,
    resetPassword
} from '../controllers/authController'

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-and-register", verifyOtpAndRegisterUser);
router.post("/login", userLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword)

export default router;
