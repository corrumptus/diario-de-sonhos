import CreatePost from "../request-response-data/requestData/CreatePost";
import Validator from "./Validator";

export default class PostValidator extends Validator<CreatePost> {
    isValid(arg: unknown): arg is CreatePost {
        return this.findError(arg) === undefined;
    }

    findError(arg: unknown): string | undefined {
        if (!Validator.isObject(arg))
            return "O corpo da requisição deve ser um objeto";

        if ("id" in arg)
            return "O id do post não deve ser passado";

        if (!("content" in arg))
            return "O post deve ter um conteúdo";

        if (!Validator.isString(arg.content))
            return "O conteúdo do post deve ser uma string";

        if (!("userId" in arg))
            return "O post deve ter um userId";

        if (!Validator.isNumber(arg.userId))
            return "O userId do post deve ser um número";

        if ("title" in arg && "parentPost" in arg)
            return "Os posts que são comentário não podem ter um titúlo";

        if ("title" in arg && !Validator.isString(arg.title))
            return "O titúlo de um post deve ser uma string";

        if ("parentPost" in arg && !Validator.isNumber(arg.parentPost))
            return "O titúlo de um post deve ser um número";

        return undefined;
    }
}