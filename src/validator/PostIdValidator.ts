import Post from "../model/Post";
import Validator from "./Validator";

export default class PostIdValidator extends Validator<Post["id"]> {
    isValid(arg: unknown): arg is Post["id"] {
        if (!Validator.isNumber(arg))
            return false;

        return true;
    }

    findError(arg: unknown): string | undefined {
        if (!this.isValid(arg))
            return "O id deve ser um numero";

        return undefined;
    }
}