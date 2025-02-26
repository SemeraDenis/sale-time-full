import { Post } from '../entity/post.entity';
import { CreatePostRequestDto } from '../dto/create-post.dto';
import { User } from '../entity/user.entity';

export class PostEntityBuilder {
  private _post: Post;

  constructor() {
    this._post = new Post();
  }

  withDto(dto: CreatePostRequestDto) : PostEntityBuilder{
    this._post.title = dto.title;
    this._post.description = dto.description;
    this._post.price = dto.price;
    this._post.categoryId = dto.category;

    return this;
  }

  withUser(userId: number ): PostEntityBuilder{
    this._post.ownerId = userId;

    return this;
  }


  public getResult(): Post {
    return this._post;
  }
}