import { Request, Response } from "express";
import { UserService } from "../services/auth.service";
import ApiResponse from "../dtos/apiResponse";
import { promises } from "dns";


export class AuthController {
    static async register(req: Request, res: Response): Promise<Response<ApiResponse, Record<string, any>>> {
        try {
            // console.log("Register endpoint hit with body:", req.body);
            const { firstName, lastName, email, password } = req.body;

            const newUser = await UserService.register({ firstName, lastName, email, password });
            return res.status(newUser.statusCode).json(newUser);
        } catch (error) {
            if (error instanceof ApiResponse) {
                return res.status(error.statusCode).json(error);
            }
            return res.status(500).json(new ApiResponse(500, false, 'Internal Server Error', null));
        }
    }
}