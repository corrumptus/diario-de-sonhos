import Post from "../../model/Post";

type CreatePost = {
    title: string,
    content: string
} | {
    parentPost: Post["id"],
    content: string
}

export default CreatePost;