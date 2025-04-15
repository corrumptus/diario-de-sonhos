import Like from "../../model/Like";
import Post from "../../model/Post";
import User from "../../model/User";

export default class LikeResponse {
    id: number;
    userId: Post["id"];
    postId: User["id"];

    constructor(like: Like) {
        this.id = like.id;
        this.userId = like.user.id;
        this.postId = like.post.id;
    }
}