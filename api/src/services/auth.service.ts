import ApiResponse from "../dtos/apiResponse";
import userModel from "../models/userModel";
import bcrypt from 'bcrypt';

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

        // const saltRounds = 10;
        // const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        // // userData.password = hashedPassword;
        // console.log(hashedPassword)
        const user = new userModel(userData);
        try {
            await user.save();
            return new ApiResponse(201, true, "User registered successfully", user);
        } catch (error) {
            console.error("Error registering user:", error);
            return new ApiResponse(500, false, "Failed to register user", error);
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

        return new ApiResponse(200, true, "Login successful", user);
    }
}
