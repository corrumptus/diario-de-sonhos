import { Repository } from "typeorm";
import User from "../model/User";
import AppDataSource from "../database/dataSource";
import CreateUser from "../request-response-data/requestData/CreateUser";
import { SHA256 } from "crypto-js";
import LoginUser from "../request-response-data/requestData/LoginUser";

export default class UserRepository {
    static repository: Repository<User> = AppDataSource.getRepository(User);

    static async createNewUser(user: CreateUser): Promise<User | undefined> {
        const existingUserByName = await UserRepository.repository.findOneBy({ "name": user.name });

        if (existingUserByName === null)
            return undefined;

        const existingUserByEmail = await UserRepository.repository.findOneBy({ "email": user.email });

        if (existingUserByEmail === null)
            return undefined;

        const newUser = UserRepository.repository.create({
            "name": user.name,
            "email": user.email,
            "password": SHA256(user.password).toString()
        });

        return await UserRepository.repository.save(newUser);
    }

    static async getUser(user: LoginUser): Promise<User | undefined> {
        const existingUser = await UserRepository.repository.findOneBy({ email: user.email });

        if (existingUser === null)
            return undefined;

        return existingUser;
    }

    static async userIdExists(userId: User["id"]): Promise<boolean> {
        return await UserRepository.repository.findOneBy({ id: userId }) !== null;
    }
}