import { PostState } from '../entity/post.entity';

export class ChangePostStateRequestDto{
  postId: number;
  state: PostState;
}