import ApiResponse from "../dtos/apiResponse";
import userModel from "../models/userModel";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

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
        console.log(passwordMatch);
        if (!passwordMatch) {
            return new ApiResponse(401, false, "Invalid credentials", null);
        }

        const accessToken = jwt.sign({ userId: user._id, email: user.email }, 'karantest', { expiresIn: '1h' });

        return new ApiResponse(200, true, "Login successful", { user, accessToken });
    }

    static async getUserData(accessToken: string): Promise<ApiResponse> {
        if (!accessToken) {
            return new ApiResponse(401, false, "Access token is required", null);
        }
        let decodedToken = jwt.verify(accessToken, 'karantest') as JwtPayload;
        // console.log(decodedToken)
        const userId = decodedToken.userId;
        const user = await userModel.findById(userId).select('-password');
        if (!user) {
            return new ApiResponse(404, false, "User not found", null);
        }
        return new ApiResponse(200, true, "User data retrieved successfully", user);
    }
}
