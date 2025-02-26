import { PostService } from '../post.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DataSource, Repository, Like, ILike} from 'typeorm';
import { Post, PostState } from '../../entity/post.entity';
import { CreatePostRequestDto } from '../../dto/create-post.dto';
import { PostEntityBuilder } from '../../mapper/post-entity-builder';
import { CommonNotfoundException } from '../../errors/exceptions/common.notfound-exception';
import { PagedPostListFilterModel } from '../../model/post-get-filter.model';
import { CommonForbiddenException } from '../../errors/exceptions/common.forbidden-exception';
import { User } from '../../entity/user.entity';
import { CommonUnauthorizedException } from '../../errors/exceptions/common.unauthorized-exception';

@Injectable()
export class DefaultPostService implements PostService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>
  ) {}

  async create(currentUserId: number, dto: CreatePostRequestDto): Promise<void> {
    const newPostEntity = new PostEntityBuilder()
      .withDto(dto)
      .withUser(currentUserId)
      .getResult();

    await this.postsRepository.save(newPostEntity);
  }

  async getPosts(filter: PagedPostListFilterModel): Promise<{ totalCount: number, records: Post[] }> {
    const pageSize: number = filter.pageSize;
    const skip: number = (filter.page - 1) * pageSize;

    const whereCondition: any = {};
    if (filter.category) {
      whereCondition.category = {id: filter.category};
    }

    if (filter.title && filter.title.length > 0) {
      whereCondition.title = ILike(`%${filter.title}%`);
    }

    if (filter.userId && filter.userId > 0){
        whereCondition.owner = {id: filter.userId};
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
