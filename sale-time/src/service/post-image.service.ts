import {Post} from "../entity/post.entity";

export interface PostImageService {
    saveImages(post: Post, s3url: string[]): Promise<void>;
}