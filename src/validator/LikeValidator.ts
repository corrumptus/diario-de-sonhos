import CreateLike from "../request-response-data/requestData/CreateLike";
import Validator from "./Validator"

export default class LikeValidator extends Validator<CreateLike> {
    isValid(arg: unknown): arg is CreateLike {
        return this.findError(arg) === undefined;
    }
    findError(arg: unknown): string | undefined {
        if (!Validator.isObject(arg))
            return "O corpo da requisição deve ser um objeto";

        if (!("userId" in arg))
            return "O like deve ter um userId";

        if (!Validator.isNumber(arg.userId))
            return "O userId do like deve ser um número";

        if (!("postId" in arg))
            return "O like deve ter um postId";

        if (!Validator.isNumber(arg.postId))
            return "O postId do like deve ser um número";
    }
}