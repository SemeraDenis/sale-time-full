import { CreatePostRequestDto } from '../dto/create-post.dto';
import { ChangePostRequestDto } from "../dto/get-post-list.dto";
import { PagedPostListFilterModel } from '../model/post-get-filter.model';
import { Post, PostState } from '../entity/post.entity';


export interface PostService {
  create(currentUserId: number, dto: CreatePostRequestDto, images: Express.Multer.File[]): Promise<void>;

  getPosts(filter: PagedPostListFilterModel): Promise<{ totalCount: number, records: Post[] }>;

  getById(id: number): Promise<Post>;

  findPostForOwner(postId: number, owner: number): Promise<Post>;

  updatePost(id: number, currentUserId: number, dto: ChangePostRequestDto): Promise<void>;

  changeState(id: number, currentUserId: number, status: PostState): Promise<void>;
}
