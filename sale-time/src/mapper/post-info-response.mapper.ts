import { PostInfoResponseDto } from '../dto/get-post-list.dto';
import { Post } from '../entity/post.entity';

export class PostInfoResponseDtoMapper {

  public static toDto(entity: Post) : PostInfoResponseDto {
    let dto = new PostInfoResponseDto();
    dto.id = entity.id;
    dto.published = entity.created;
    dto.title = entity.title;
    dto.price = entity.price;
    dto.previewUrl = 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Phone_icon.png'

    return dto;
  }
}