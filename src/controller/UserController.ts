import { Repository } from "typeorm";
import User from "../model/User";
import AppDataSource from "../database/dataSource";
import UserValidator from "../validator/UserValidator";
import CreateUser from "../request-response-data/requestData/CreateUser";
import UserRepository from "../repository/UserRepository";
import jwt from "jsonwebtoken";
import LoginUser from "../request-response-data/requestData/LoginUser";
import UserLoginValidator from "../validator/UserLoginValidator";
import { SHA256 } from "crypto-js";

export default class UserController {
    static repository: Repository<User> = AppDataSource.getRepository(User);

    static async createNewUser(user: any): Promise<{
        token: string,
        error?: undefined
    } | {
        error: string,
        token?: undefined
    }> {
        const error = new UserValidator().findError(user);

        if (error !== undefined)
            return { error: error };

        const createdUser = await UserRepository.createNewUser(user as CreateUser);

        if (createdUser === undefined)
            return { error: "Não foi possível criar o post" };

        const accessToken = jwt.sign({ id: createdUser.id }, process.env.PASSWORD_ENCODER as string);

        return { token: accessToken };
    }

    static async loginUser(user: any): Promise<{
        token: string,
        error?: undefined
    } | {
        error: string,
        token?: undefined
    }> {
        const error = new UserLoginValidator().findError(user);

        if (error !== undefined)
            return { error: error };

        const existingUser = await UserRepository.getUser(user as LoginUser);

        if (existingUser === undefined)
            return { error: "O usuário ou a senha estão incorretos" };

        if (existingUser.password !== SHA256(user.password).toString())
            return { error: "O usuário ou a senha estão incorretos" };

        const accessToken = jwt.sign({ id: existingUser.id }, process.env.PASSWORD_ENCODER as string);

        return { token: accessToken };
    }

    static async deleteUser(userId: User["id"]): Promise<boolean> {
        const user = await UserRepository.repository.findOneBy({ "id": userId });

        if (user === null)
            return false;

        UserRepository.repository.remove(user);

        return true;
    }
}