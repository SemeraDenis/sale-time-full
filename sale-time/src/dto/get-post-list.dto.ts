import {PostStatus} from "../common/enums/post-status.enum";

export class PostListFilterRequestDto{
  query: string;
  category: number;
  currentUserOnly: boolean = false;
}

export class PreviewPostListDto {
  totalCount: number;
  totalPageCount: number;
  posts: PostPreviewDto [];
}

export class PostPreviewDto  {
  id: number;
  status: PostStatus;
  published: Date;
  title: string;
  price: number;
  previewImg: number;
}

export class PostEditableDataInfoDto  {
  title: string;
  description: string;
  price: number;
  category: number;
}
export class ChangePostRequestDto  {
  title: string;
  description: string;
  price: number;
}
export class ChangeStatusPostRequestDto  {
  status: PostStatus;
}

export class PostSummaryDto {
  id: number;
  published: Date;
  title: string;
  price: number;
  description: string;
  images: number[];
  seller: SellerInfoDto;
}

export class SellerInfoDto {
  id: number;
  fullName: string;
  phoneNumber: string;
}
