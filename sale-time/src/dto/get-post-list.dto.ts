export class PostListFilterRequestDto{
  query: string;
  category: number;
}

export class PostListResponseDto {
  totalCount: number;
  totalPageCount: number;
  posts: PostInfoResponseDto[];
}

export class PostInfoResponseDto {
  id: number;
  published: Date;
  title: string;
  price: number;
  previewUrl: string;
}

export class PostDetailsResponseDto {
  title: string;
  description: string;
  price: number;
  created: Date;
  images: number[];
}
