import {Post} from "../entity/post.entity";
import {PostImage} from "../entity/post-image.entity";

export interface PostImageService {
    saveImagesInfo(post: Post, s3FileName: string): Promise<void>;
    getAllImageInfo(post: Post): Promise<PostImage[]>;
    getImageInfo(postImageId: number): Promise<PostImage>;
}