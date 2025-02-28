import {PostStatus} from "../common/enums/post-status.enum";

export class ChangePostStateRequestDto{
  postId: number;
  state: PostStatus;
}