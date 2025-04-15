import Like from "../model/Like";
import Validator from "./Validator";

export default class LikeIdValidator extends Validator<Like["id"]> {
    isValid(arg: unknown): arg is number {
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