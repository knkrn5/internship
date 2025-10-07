import userModel from "../models/userModel";


export class UserService {
    static async register(userData: { firstName: string; lastName: string; email: string; password: string }) {
        console.log("Registering user with data:", userData);
        const user = new userModel(userData);
        return await user.save();
    }
}