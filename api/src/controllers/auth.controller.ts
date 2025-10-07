import { Request, Response } from "express";
import { UserService } from "../services/auth.service";


export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            // console.log("Register endpoint hit with body:", req.body);
            const { firstName, lastName, email, password } = req.body;
            console.log(firstName, lastName, email, password);

            const newUser = await UserService.register({ firstName, lastName, email, password });
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}