import CreateUser from "../request-response-data/requestData/CreateUser";
import Validator from "./Validator";

export default class UserValidator extends Validator<CreateUser> {
    isValid(arg: unknown): arg is CreateUser {
        return this.findError(arg) === undefined;
    }

    findError(arg: unknown): string | undefined {
        if (!Validator.isObject(arg))
            return "O corpo da requisição deve ser um objeto";

        if (!("name" in arg))
            return "O usuário deve ter um nome";

        if (!Validator.isString(arg.name))
            return "O name do usuário deve ser uma string";

        if (arg.name.trim() === "")
            return "O name do usuário não pode estar em branco";

        if (!("email" in arg))
            return "O usuário deve ter um email";

        if (!Validator.isString(arg.email))
            return "O email do usuário deve ser uma string";

        if (arg.email.trim() === "")
            return "O email do usuário não pode estar em branco";

        if (!("password" in arg))
            return "O usuário deve ter um password";

        if (!Validator.isString(arg.password))
            return "O password do usuário deve ser uma string";

        if (arg.password.trim() === "")
            return "O password do usuário não pode estar em branco";
    }
    
}