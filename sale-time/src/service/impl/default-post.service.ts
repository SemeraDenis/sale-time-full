import { Inject, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, ILike} from 'typeorm';
import { PostService } from '../post.service';
import { S3Service } from "../../s3/s3.service";
import { PostImageService } from "../post-image.service";
import { Post, PostState } from '../../entity/post.entity';
import { CreatePostRequestDto } from '../../dto/create-post.dto';
import { PostEntityBuilder } from '../../mapper/post-entity-builder';
import { CommonNotfoundException } from '../../errors/exceptions/common.notfound-exception';
import { CommonForbiddenException } from '../../errors/exceptions/common.forbidden-exception';
import { PagedPostListFilterModel } from '../../model/post-get-filter.model';


@Injectable()
export class DefaultPostService implements PostService {
  constructor(
      private readonly dataSource: DataSource,
      @InjectRepository(Post) private readonly postsRepository: Repository<Post>,

      @Inject('PostImageService') private readonly postImageService: PostImageService,
      @Inject('S3Service') private readonly s3Service: S3Service,
  ) {}

  async create(currentUserId: number, dto: CreatePostRequestDto, images: Express.Multer.File[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //Создаем сущность из dto
      const postEntity = new PostEntityBuilder()
          .withDto(dto)
          .withUser(currentUserId)
          .getResult();

      //Сохраняем для получения id
      await queryRunner.manager.save(postEntity);

      // Загружаем в MinIO
      if (images.length > 0) {
        await Promise.all(
            images.map(async (file) => {
              const uploadInfo = await this.s3Service.uploadFile(file);
              await this.postImageService.saveImagesInfo(postEntity, uploadInfo.key, uploadInfo.mimeType, uploadInfo.size);
            })
        );
      }

      await queryRunner.commitTransaction();
      return;
    }
    catch (error){
      await queryRunner.rollbackTransaction();
      throw error;
    }
    finally {
      await queryRunner.release();
    }
  }

  async getPosts(filter: PagedPostListFilterModel): Promise<{ totalCount: number, records: Post[] }> {
    const pageSize: number = filter.pageSize;
    const skip: number = (filter.page - 1) * pageSize;

    const whereCondition: any = {};
    if (filter.category) {
      whereCondition.categoryId = filter.category;
    }

    if (filter.title && filter.title.length > 0) {
      whereCondition.title = ILike(`%${filter.title}%`);
    }

    if (filter.userId && filter.userId > 0){
        whereCondition.ownerId = filter.userId;
    }

    const countRecords = this.postsRepository.countBy(whereCondition);
    const resultRecords = this.postsRepository.find({
      where: whereCondition,
      take: pageSize,
      skip: skip,
      order: { created: "DESC" }
    });

    const totalCount = await countRecords;
    const records = await resultRecords;

    return {totalCount, records};
  }


  async details(id: number): Promise<Post> {
    return await this.getPostByIdOrThrow(id);
  }

  async changeState(id: number, currentUserId: number, status: PostState): Promise<void> {
    let post = await this.getPostByIdOrThrow(id);

    if (post.ownerId != currentUserId)
      throw new CommonForbiddenException('Post is not available');

    post.status = status;
    await this.postsRepository.save(post);
  }

  private async getPostByIdOrThrow(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post)
      throw new CommonNotfoundException('Post not found');

    return post;
  }
}
