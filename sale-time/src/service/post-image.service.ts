import {Post} from "../entity/post.entity";
import {PostImage} from "../entity/post-image.entity";

export interface PostImageService {
    saveImagesInfo(post: Post, s3FileKey: string, mimeType: string, size: number): Promise<void>;
    getPostImagesInfo(post: Post): Promise<PostImage[]>;
    getImageInfo(postImageId: number): Promise<PostImage>;
}