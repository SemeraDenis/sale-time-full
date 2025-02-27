import {
  Body,
  Controller,
  Get,
  Post,
  Inject,
  Param,
  HttpCode, HttpStatus
} from '@nestjs/common';
import { PostService } from '../service/post.service';
import {PostImageService} from "../service/post-image.service";

import {
  PostDetailsResponseDto,
  PostListFilterRequestDto,
  PostListResponseDto
} from '../dto/get-post-list.dto';

import { Post as PostEntity } from '../entity/post.entity';

import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PagedPostListFilterModelBuilder } from '../model/post-get-filter.model';
import {PostInfoResponseDtoMapper} from "../mapper/post-info-response.mapper";
import {CommonBadRequestException} from "../errors/exceptions/common.badrequest-exception";
import {CommonNotfoundException} from "../errors/exceptions/common.notfound-exception";



@Controller()
export class PostController {
  constructor(
    @Inject('PostService') private readonly postService: PostService,
    @Inject('PostImageService') private readonly postImageService: PostImageService
  ) {}

  @Post('get-posts/:page')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get paged posts' })
  @ApiResponse({ status: 200, description: 'Posts info.' })
  async getPosts(
    @Param('page') page: number,
    @Body() filterDto: PostListFilterRequestDto): Promise<PostListResponseDto> {

    const pageSize= 10;
    const filterParam = new PagedPostListFilterModelBuilder()
        .withPage(page)
        .withPageSize(pageSize)
        .withTitle(filterDto?.query)
        .withCategory(filterDto?.category)
        .getResult();

    const posts = await this.postService.getPosts(filterParam);

    const resultDto = new PostListResponseDto();
    resultDto.totalCount = posts.totalCount;
    resultDto.totalPageCount = Math.ceil(resultDto.totalCount / pageSize);
    resultDto.posts = posts.records.map(post=> PostInfoResponseDtoMapper.toDto(post));
    return resultDto;
  }

  @Get('post-details/:id')
  @ApiOperation({ summary: 'Get post details' })
  @ApiResponse({ status: 200, description: 'Post details.' })
  async postDetails(@Param('id') id: number): Promise<PostDetailsResponseDto> {
    if (id < 1)
      throw new CommonBadRequestException('incorrect parameter');

    const post = await this.postService.details(id);
    if (!post)
      throw new CommonNotfoundException('Post not found');


    const dto = new PostDetailsResponseDto();
    dto.title = post.title;
    dto.description = post.description;
    dto.price = post.price;
    dto.created = post.created;

    await this.addImageInfos(dto, post);

    return dto;
  }

  private async addImageInfos(dto: PostDetailsResponseDto, post: PostEntity){
    const images = await this.postImageService.getAllImageInfo(post);
    if (!images || images.length < 1)
      return;

    dto.images = images.map(x=>x.id);
  }
}
