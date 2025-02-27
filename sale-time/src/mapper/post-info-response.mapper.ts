import { PostPreviewDto, PostSummaryDto} from '../dto/get-post-list.dto';
import {Post as PostEntity, Post} from '../entity/post.entity';
import {PostImageService} from "../service/post-image.service";

export class PostDtoMapper {
  constructor(private readonly postImageService: PostImageService) {

  }

  public async toPostPreviewDto(entity: Post) : Promise<PostPreviewDto> {
    const dto = new PostPreviewDto();

    dto.id = entity.id;
    dto.published = entity.created;
    dto.title = entity.title;
    dto.price = entity.price;

    const images = await this.getPostImageIdList(entity);
    if (images.length > 0) {
      dto.previewImg = images[0];
    }

    return dto;
  }

  public async toPostSummaryDto(entity: Post) : Promise<PostSummaryDto>{
    const dto = new PostSummaryDto();

    dto.id = entity.id;
    dto.title = entity.title;
    dto.description = entity.description;
    dto.price = entity.price;
    dto.published = entity.created;
    dto.images = await this.getPostImageIdList(entity);

    return dto;

  }



  private async getPostImageIdList(post: PostEntity): Promise<number[]>{
    const images = await this.postImageService.getPostImagesInfo(post);
    if (!images || images.length < 1) {
      return [];
    }

    return images.map(x=>x.id);
  }
}