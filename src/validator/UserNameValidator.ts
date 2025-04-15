import User from "../model/User";
import Validator from "./Validator";

export default class UserNameValidator extends Validator<User["name"]> {
    isValid(arg: unknown): arg is User["name"] {
        if (!Validator.isString(arg))
            return false;

        if (arg.trim() === "")
            return false;

        return true;
    }

    findError(arg: unknown): string | undefined {
        if (!this.isValid(arg))
            return "O name deve ser uma string não vazia";

        return undefined;
    }
}