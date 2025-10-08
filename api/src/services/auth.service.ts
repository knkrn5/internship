import ApiResponse from "../dtos/apiResponse.js";
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendMailOtp } from "../utils/emailer.js";
import { redisClient } from "../db/redisConnect.js";
import { devNull } from "node:os";


export class UserService {

    static async findByEmail(email: string): Promise<ApiResponse> {

        if (!email) {
            return new ApiResponse(400, false, "Email is required", null);
        }

        const user = await userModel.exists({ email });
        if (!user) {
            return new ApiResponse(404, false, "User not found", null);
        }
        return new ApiResponse(200, true, "User Already Exists", user);
    }

    static async sendEmailOtp(receiverEmail: string): Promise<ApiResponse> {
        if (!receiverEmail) {
            return new ApiResponse(400, false, "Email is required", null);
        }

        // Check if Redis is connected
        if (!redisClient.isOpen) {
            console.error("❌ Redis is not connected");
            return new ApiResponse(503, false, "Service temporarily unavailable. Please try again later.", null);
        }

        try {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedOtp = await bcrypt.hash(otp, 10);

            await redisClient.set(receiverEmail, hashedOtp, { EX: 300 });

            await sendMailOtp(receiverEmail, `${otp} Your OTP Code`, `Your OTP code is ${otp}`);
            return new ApiResponse(200, true, "OTP sent successfully", devNull);
        } catch (error: any) {
            console.error("❌ Error in sendEmailOtp:", error);
            return new ApiResponse(500, false, "Failed to send OTP. Please try again.", {
                message: error?.message ?? 'Unknown error'
            });
        }

    }

    static async verifyEmailOtp(receiverEmail: string, enteredOtp: string): Promise<ApiResponse> {
        if (!receiverEmail) {
            return new ApiResponse(400, false, "Email is required", null);
        }
        if (!enteredOtp) {
            return new ApiResponse(400, false, "OTP is required", null);
        }

        // Check if Redis is connected
        if (!redisClient.isOpen) {
            console.error("❌ Redis is not connected");
            return new ApiResponse(503, false, "Service temporarily unavailable. Please try again later.", null);
        }

        try {
            const storedOtp = await redisClient.get(receiverEmail);
            if (!storedOtp) {
                return new ApiResponse(400, false, "OTP expired or not found. Please request a new OTP.", null);
            }
            const isMatch = await bcrypt.compare(enteredOtp, storedOtp);
            if (isMatch) {
                await redisClient.del(receiverEmail);
                return new ApiResponse(200, true, "OTP verified successfully", null);
            } else {
                return new ApiResponse(400, false, "Invalid OTP. Please check and try again.", null);
            }
        } catch (error: any) {
            console.error("❌ Error in verifyEmailOtp:", error);
            return new ApiResponse(500, false, "Failed to verify OTP. Please try again.", {
                message: error?.message ?? 'Unknown error'
            });
        }
    }

    static async register(userData: { firstName: string; lastName: string; email: string; password: string }): Promise<ApiResponse> {
        const user = new userModel(userData);
        try {
            await user.save();
            return new ApiResponse(201, true, "User registered successfully", user);
        } catch (error: any) {
            console.error("Error registering user:", error);

            // Duplicate key (e.g., email unique index) => 409 Conflict
            if (error?.code === 11000) {
                return new ApiResponse(
                    409,
                    false,
                    "Email already registered",
                    { keyValue: error.keyValue }
                );
            }

            // Mongoose validation error => 400 Bad Request
            if (error?.name === 'ValidationError' && error?.errors) {
                const details = Object.values(error.errors).map((e: any) => ({
                    path: e?.path,
                    message: e?.message,
                }));
                return new ApiResponse(400, false, "Validation failed", { errors: details });
            }

            // Fallback: return a serializable message instead of raw Error instance
            return new ApiResponse(500, false, "Failed to register user", {
                message: error?.message ?? 'Unknown error',
                name: error?.name,
            });
        }
    }

    static async login(email: string, password: string): Promise<ApiResponse> {
        if (!email) {
            return new ApiResponse(400, false, "Email is required", null);
        }

        if (!password) {
            return new ApiResponse(400, false, "Password is required", null);
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return new ApiResponse(404, false, "User not found", null);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return new ApiResponse(401, false, "Invalid credentials", null);
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }

        const accessToken = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        return new ApiResponse(200, true, "Login successful", { user, accessToken });
    }

    static async getUserData(accessToken: string): Promise<ApiResponse> {
        if (!accessToken) {
            return new ApiResponse(401, false, "Access token is required", null);
        }

        try {
            const JWT_SECRET = process.env.JWT_SECRET;
            if (!JWT_SECRET) {
                throw new Error('JWT_SECRET environment variable is not defined');
            }
            const decodedToken = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;
            const userId = decodedToken.userId;

            const user = await userModel.findById(userId).select('-password -_id -createdAt -updatedAt');
            if (!user) {
                return new ApiResponse(404, false, "User not found", null);
            }

            return new ApiResponse(200, true, "User data retrieved successfully", user);
        } catch (error: any) {
            console.error("Error verifying token:", error);

            // JWT specific errors
            if (error?.name === 'TokenExpiredError') {
                return new ApiResponse(401, false, "Token expired", null);
            }

            if (error?.name === 'JsonWebTokenError') {
                return new ApiResponse(401, false, "Invalid token", null);
            }

            return new ApiResponse(500, false, "Failed to verify token", {
                message: error?.message ?? 'Unknown error'
            });
        }
    }

}
