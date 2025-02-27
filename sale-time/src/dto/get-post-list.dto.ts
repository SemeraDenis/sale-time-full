export class PostListFilterRequestDto{
  query: string;
  category: number;
}

export class PreviewPostListDto {
  totalCount: number;
  totalPageCount: number;
  posts: PostPreviewDto [];
}

export class PostPreviewDto  {
  id: number;
  published: Date;
  title: string;
  price: number;
  previewImg: number;
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
