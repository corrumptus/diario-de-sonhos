import User from "../model/User";
import LikeRepository from "../repository/LikeRepository";
import UserRepository from "../repository/UserRepository";
import CreateLike from "../request-response-data/requestData/CreateLike";
import LikeResponse from "../request-response-data/responseData/LikeResponse";
import LikeIdValidator from "../validator/LikeIdValidator";
import LikeValidator from "../validator/LikeValidator";

export default class LikeController {
    static async createNewLike(like: any, userId: User["id"]): Promise<{
        createdLike: LikeResponse,
        error?: undefined
    } | {
        createdLike?: undefined,
        error: string
    }> {
        const error = new LikeValidator().findError(like);

        if (error !== undefined)
            return { error: error };

        const userIdExists = await UserRepository.userIdExists(userId);

        if (!userIdExists)
            return { error: "O usuário não existe" };

        if ((like as CreateLike).userId !== userId)
            return { error: "O usuário só pode criar likes próprios" };

        const createdLike = await LikeRepository.createNewLike(like as CreateLike);

        if (createdLike === undefined)
            return { error: "Não foi possível criar o like" };

        return { createdLike: new LikeResponse(createdLike) };
    }

    static async deleteLike(likeId: any, userId: User["id"]): Promise<boolean> {
        const isValidLikeId = new LikeIdValidator().isValid(likeId);

        if (!isValidLikeId)
            return false;
        
        
        const like = await LikeRepository.getLike(likeId);

        if (like === undefined)
            return false;

        if (like.user.id !== userId)
            return false;

        const isDeleted = await LikeRepository.deleteLike(likeId);

        return isDeleted;
    }
}