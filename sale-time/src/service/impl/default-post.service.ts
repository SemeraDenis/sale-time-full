import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DataSource, ILike, Repository, Not} from 'typeorm';

import {PostService} from '../post.service';
import {S3Service} from "../../s3/s3.service";
import {PostImageService} from "../post-image.service";

import {Post} from '../../entity/post.entity';
import {PostEntityBuilder} from '../../mapper/post-entity-builder';
import {CommonNotfoundException} from '../../errors/exceptions/common.notfound-exception';
import {CommonForbiddenException} from '../../errors/exceptions/common.forbidden-exception';

import {PostStatus} from "../../common/enums/post-status.enum";
import {PagedPostListFilterModel} from '../../model/post-get-filter.model';
import {CreatePostRequestDto} from '../../dto/create-post.dto';
import {ChangePostRequestDto} from "../../dto/get-post-list.dto";


@Injectable()
export class DefaultPostService implements PostService {
  constructor(
      private readonly dataSource: DataSource,
      @InjectRepository(Post) private readonly postsRepository: Repository<Post>,

      @Inject('PostImageService') private readonly postImageService: PostImageService,
      @Inject('S3Service') private readonly s3Service: S3Service,
  ) {}

  //region interface PostService

  //region CUD operations

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

  async updatePost(id: number, ownerId: number, dto: ChangePostRequestDto): Promise<void> {
    const post = await this.findPostForOwner(id, ownerId);

    post.title = dto.title;
    post.description = dto.description;
    post.price = dto.price;

    await this.postsRepository.save(post);
  }

  async delete(id: number, ownerId: number): Promise<void> {
    const post = await this.findPostForOwner(id, ownerId);

    post.status = PostStatus.DELETED;
    await this.postsRepository.save(post);
  }

  //endregion

  //region Read operations

  async getById(id: number): Promise<Post> {
    return await this.getPostByIdOrThrow(id);
  }

  async findPostForOwner(id: number, ownerId: number): Promise<Post> {
    const post = await this.getPostByIdOrThrow(id);

    if (post.ownerId != ownerId) {
      throw new CommonForbiddenException('Post is not available');
    }

    return post;
  }

  async getPosts(filter: PagedPostListFilterModel): Promise<{ totalCount: number, records: Post[] }> {
    const pageSize: number = filter.pageSize;
    const skip: number = (filter.page - 1) * pageSize;

    const whereCondition: any = this.excludeDeletedPosts();
    if (filter.category) {
      whereCondition.categoryId = filter.category;
    }

    if (filter.title && filter.title.length > 0) {
      whereCondition.title = ILike(`%${filter.title}%`);
    }

    if (filter.userId && filter.userId > 0){
      whereCondition.ownerId = filter.userId;
    }

    if (filter.status){
      whereCondition.status = filter.status;
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

  //endregion

  //region other operations

  async changeStatus(id: number, ownerId: number, status: PostStatus): Promise<void> {
    const post = await this.findPostForOwner(id, ownerId);

    post.status = status;
    await this.postsRepository.save(post);
  }

  //endregion

  //endregion

  //region private

  private async getPostByIdOrThrow(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne(this.excludeDeletedPosts({ where: { id } }));
    if (!post)
      throw new CommonNotfoundException('Post not found');

    return post;
  }

  private excludeDeletedPosts(whereCondition: Record<string, any> = {}): Record<string, any> {
    whereCondition.status = Not(PostStatus.DELETED);
    return whereCondition;
  }

  //endregion
}
