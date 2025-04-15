import Post from "../model/Post";
import User from "../model/User";
import PostRepository from "../repository/PostRepository";
import CreatePost from "../request-response-data/requestData/CreatePost";
import PostResponse from "../request-response-data/responseData/PostResponse";
import PostIdValidator from "../validator/PostIdValidator";
import PostValidator from "../validator/PostValidator";
import UserNameValidator from "../validator/UserNameValidator";

export default class PostController {
    static async getPostsFromUser(user: any): Promise<PostResponse[]> {
        const isValidUserName = new UserNameValidator().isValid(user);

        if (!isValidUserName)
            return [];

        return (await PostRepository.getAllPostsFromUser(user)).map(p => new PostResponse(p));
    }

    static async getPost(id: any): Promise<PostResponse | undefined> {
        const isValidPostId = new PostIdValidator().isValid(id);

        if (!isValidPostId)
            return undefined;

        const post = await PostRepository.getPost(id);

        if (post === undefined)
            return undefined;

        return new PostResponse(post);
    }

    static async getPostComments(id: any): Promise<PostResponse[] | undefined> {
        const isValidPostId = new PostIdValidator().isValid(id);

        if (!isValidPostId)
            return undefined;

        const comments = await PostRepository.getPostComments(id);

        if (comments === undefined)
            return undefined;

        return comments.map(p => new PostResponse(p));
    }

    static async createNewPost(post: any, userId: User["id"]): Promise<{
        createdPost: PostResponse,
        error?: undefined
    } | {
        createdPost?: undefined,
        error: string
    }> {
        const error = new PostValidator().findError(post);

        if (error !== undefined)
            return { error: error };

        const createdPost = await PostRepository.createNewPost(post as CreatePost, userId);

        if (createdPost === undefined)
            return { error: "Não foi possível criar o post" };

        return { createdPost: new PostResponse(createdPost) };
    }

    static async deletePost(postId: any, userId: User["id"]): Promise<boolean> {
        const isValidPostId = new PostIdValidator().isValid(postId);
    
        if (!isValidPostId)
            return false;

        const post = await PostRepository.getPost(postId);

        if (post === undefined)
            return false;

        if (post.user.id !== userId)
            return false;

        const isDeleted = await PostRepository.deletePost(postId);

        return isDeleted;
    }
}