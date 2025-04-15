import { Repository } from "typeorm";
import Like from "../model/Like";
import AppDataSource from "../database/dataSource";
import CreateLike from "../request-response-data/requestData/CreateLike";
import Post from "../model/Post";
import User from "../model/User";

export default class LikeRepository {
    static likeRepository: Repository<Like> = AppDataSource.getRepository(Like);
    static postRepository: Repository<Post> = AppDataSource.getRepository(Post);
    static userRepository: Repository<User> = AppDataSource.getRepository(User);

    static async createNewLike(like: CreateLike): Promise<Like | undefined> {
        const user = await LikeRepository.userRepository.findOneBy({ "id": like.userId });

        if (user === null)
            return undefined;

        const parentPost = await LikeRepository.postRepository.findOneBy({ "id": like.postId });

        if (parentPost === null)
            return undefined;

        const existentLike = await LikeRepository.likeRepository.findOneBy({
            "post": parentPost,
            "user": user
        });

        if (existentLike !== null)
            return undefined;

        const newLike = LikeRepository.likeRepository.create({
            "post": parentPost,
            "user": user
        });

        const savedLike = await LikeRepository.likeRepository.save(newLike);

        parentPost.likes++;

        LikeRepository.postRepository.save(parentPost);

        return savedLike;
    }

    static async getLike(likeId: Like["id"]): Promise<Like | undefined> {
        const like = await LikeRepository.likeRepository.findOneBy({ id: likeId });

        if (like === null)
            return undefined;

        return like;
    }

    static async deleteLike(likeId: Like["id"]): Promise<boolean> {
        const like = await LikeRepository.likeRepository.findOneBy({ "id": likeId });

        if (like === null)
            return false;

        const post = like.post;

        post.likes--;

        LikeRepository.postRepository.save(post);

        LikeRepository.likeRepository.remove(like);

        return true;
    }
}