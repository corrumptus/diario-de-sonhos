import AppDataSource from "../database/dataSource";
import Post from "../model/Post";
import User from "../model/User";
import { Repository } from "typeorm";
import CreatePost from "../request-response-data/requestData/CreatePost";

export default class PostRepository {
    static repository: Repository<Post> = AppDataSource.getRepository(Post);

    static async getAllPostsFromUser(user: User["name"]): Promise<Post[]> {
        return await PostRepository.repository.createQueryBuilder('post')
            .innerJoinAndSelect('post.user', 'user')
            .where('user.name = :name', { name: user })
            .andWhere('post.parentPost IS NULL')
            .getMany();
    }

    static async getPost(id: Post["id"]): Promise<Post | undefined> {
        const post = await PostRepository.repository.findOneBy({ "id": id });

        if (post === null)
            return undefined;

        return post;
    }

    static async getPostComments(id: Post["id"]): Promise<Post[] | undefined> {
        const parentPost = await PostRepository.repository.findOneBy({ "id": id });

        if (parentPost === null)
            return undefined;

        return await PostRepository.repository.findBy({ "parentPost": parentPost });
    }

    static async createNewPost(post: CreatePost, userId: User["id"]): Promise<Post | undefined> {
        const user = await PostRepository.repository.findOneBy({ id: userId });

        if (user === null)
            return undefined;

        let newPost!: Post;

        if ("parentPost" in post) {
            const parentPost = await PostRepository.repository.findOneBy({ id: post.parentPost });

            if (parentPost === null)
                return undefined;

            newPost = PostRepository.repository.create({
                content: post.content,
                user: user,
                parentPost: parentPost,
            });
        } else {
            newPost = PostRepository.repository.create({
                content: post.content,
                user: user,
                title: post.title,
            });
        }

        return await PostRepository.repository.save(newPost);
    }

    static async deletePost(postId: Post["id"]): Promise<boolean> {
        const post = await PostRepository.repository.findOneBy({ "id": postId });

        if (post === null)
            return false;

        PostRepository.repository.remove(post);

        return true;
    }
}