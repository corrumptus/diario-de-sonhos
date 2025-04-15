import LoginUser from "../request-response-data/requestData/LoginUser";
import Validator from "./Validator";

export default class UserLoginValidator extends Validator<LoginUser> {
    isValid(arg: unknown): arg is LoginUser {
        return this.findError(arg) === undefined;
    }

    findError(arg: unknown): string | undefined {
        if (!Validator.isObject(arg))
            return "O corpo da requisição deve ser um objeto";

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