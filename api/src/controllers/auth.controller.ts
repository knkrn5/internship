import { Request, Response } from "express";
import { UserService } from "../services/auth.service.js";
import ApiResponse from "../dtos/apiResponse.js";


export class AuthController {

    static async findByEmail(req: Request, res: Response): Promise<Response<ApiResponse, Record<string, any>>> {
        try {
            const email = req.body.email;
            console.log(email);

            const user = await UserService.findByEmail(email);
            return res.status(user.statusCode).json(user);
        } catch (error) {
            if (error instanceof ApiResponse) {
                return res.status(error.statusCode).json(error);
            }
            return res.status(500).json(new ApiResponse(500, false, 'Internal Server Error', null));
        }
    }

    static async sendEmailOtp(req: Request, res: Response): Promise<Response<ApiResponse, Record<string, any>>> {
        try {
            const { email } = req.body;
            const user = await UserService.sendEmailOtp(email);
            return res.status(user.statusCode).json(user);
        } catch (error) {
            if (error instanceof ApiResponse) {
                return res.status(error.statusCode).json(error);
            }
            return res.status(500).json(new ApiResponse(500, false, 'Internal Server Error', null));
        }
    }

    static async register(req: Request, res: Response): Promise<Response<ApiResponse, Record<string, any>>> {
        try {
            const { firstName, lastName, email, password } = req.body;

            const newUser = await UserService.register({ firstName, lastName, email, password });
            return res.status(newUser.statusCode).json(newUser);
        } catch (error) {
            if (error instanceof ApiResponse) {
                return res.status(error.statusCode).json(error);
            }
            return res.status(500).json(new ApiResponse(500, false, 'Internal Server Error', error));
        }
    }

    static async login(req: Request, res: Response): Promise<Response<ApiResponse, Record<string, any>>> {
        try {
            const { email, password } = req.body;
            const user = await UserService.login(email, password);
            if (user.IsSuccess && user.data?.accessToken) {
                res.cookie('accessToken', user.data.accessToken, {
                    httpOnly: true, secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                });
            }
            return res.status(user.statusCode).json(user);
        } catch (error) {
            if (error instanceof ApiResponse) {
                return res.status(error.statusCode).json(error);
            }
            return res.status(500).json(new ApiResponse(500, false, 'Internal Server Error', null));
        }
    }

    static async getUserData(req: Request, res: Response): Promise<Response<ApiResponse, Record<string, any>>> {
        try {
            const accessToken = req.cookies.accessToken;

            const user = await UserService.getUserData(accessToken);
            return res.status(user.statusCode).json(user);
        } catch (error) {
            if (error instanceof ApiResponse) {
                return res.status(error.statusCode).json(error);
            }
            return res.status(500).json(new ApiResponse(500, false, 'Internal Server Error', null));
        }
    }

    static async logout(_: Request, res: Response): Promise<Response<ApiResponse, Record<string, any>>> {
        try {
            res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'lax' });
            return res.status(200).json(new ApiResponse(200, true, 'Logged out successfully', null));
        } catch (error) {
            if (error instanceof ApiResponse) {
                return res.status(error.statusCode).json(error);
            }
            return res.status(500).json(new ApiResponse(500, false, 'Internal Server Error', null));
        }
    }
}