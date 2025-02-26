import { CreatePostRequestDto } from '../dto/create-post.dto';
import { PagedPostListFilterModel } from '../model/post-get-filter.model';
import {Post, PostState} from '../entity/post.entity';

export interface PostService {
  create(currentUserId: number, dto: CreatePostRequestDto, images: Express.Multer.File[]): Promise<void>;

  getPosts(filter: PagedPostListFilterModel): Promise<{ totalCount: number, records: Post[] }>;

  details(id: number): Promise<Post>;

  changeState(id: number, currentUserId: number, status: PostState): Promise<void>;
}
