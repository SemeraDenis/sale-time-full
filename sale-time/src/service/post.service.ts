import { CreatePostRequestDto } from '../dto/create-post.dto';
import { ChangePostRequestDto } from "../dto/get-post-list.dto";
import { PagedPostListFilterModel } from '../model/post-get-filter.model';
import { Post } from '../entity/post.entity';
import { PostStatus } from "../common/enums/post-status.enum";


export interface PostService {
  create(currentUserId: number, dto: CreatePostRequestDto, images: Express.Multer.File[]): Promise<void>;

  updatePost(id: number, currentUserId: number, dto: ChangePostRequestDto): Promise<void>;

  delete(id: number, currentUserId: number): Promise<void>;


  getById(id: number): Promise<Post>;

  findPostForOwner(postId: number, owner: number): Promise<Post>;

  getPosts(filter: PagedPostListFilterModel): Promise<{ totalCount: number, records: Post[] }>;


  changeStatus(id: number, currentUserId: number, status: PostStatus): Promise<void>;
}
