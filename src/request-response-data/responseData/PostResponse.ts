import Post from "../../model/Post";
import User from "../../model/User";

export default class PostResponse {
    id: number;
    title: string | undefined;
    content: string;
    userId: User["id"];
    likes: number;
    parentId: Post["id"] | undefined;
    createdAt: Date;

    constructor(post: Post) {
        this.id = post.id;
        this.title = post.title;
        this.content = post.content;
        this.userId = post.user.id;
        this.likes = post.likes;
        this.parentId = post.parentPost?.id;
        this.createdAt = post.createdAt;
    }
}