import {
  Body,
  Controller,
  Get,
  Post,
  Inject,
  Param,
  HttpCode, HttpStatus, Req,
  UseGuards
} from '@nestjs/common';
import { PostService } from '../service/post.service';
import {PostImageService} from "../service/post-image.service";
import {UserService} from "../service/user.service";

import {
  PreviewPostListDto, PostSummaryDto,
  PostListFilterRequestDto,
} from '../dto/get-post-list.dto';


import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PagedPostListFilterModelBuilder } from '../model/post-get-filter.model';
import {PostDtoMapper} from "../mapper/post-info-response.mapper";
import {CommonBadRequestException} from "../errors/exceptions/common.badrequest-exception";
import {CommonNotfoundException} from "../errors/exceptions/common.notfound-exception";
import {PostStatus} from "../common/enums/post-status.enum";
import {JwtUserInfo} from "../model/jwt-user-info.model";
import {CurrentUser} from "../auth/current-user.decorator";
import {OptionalJwtAuthGuard} from "../auth/guards/optional-jwt-auth.guard";
import {CommonUnauthorizedException} from "../errors/exceptions/common.unauthorized-exception";




@Controller()
export class PostController {
  constructor(
    @Inject('PostService') private readonly postService: PostService,
    @Inject('PostImageService') private readonly postImageService: PostImageService,
    @Inject('UserService') private readonly userService: UserService,
  ) {
  }

  @Post('get-posts/:page')
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get paged posts' })
  @ApiResponse({ status: 200, description: 'Posts info.' })
  async getAllPosts(
    @Param('page') page: number,
    @CurrentUser() currentUser: JwtUserInfo | null,
    @Body() filterDto: PostListFilterRequestDto): Promise<PreviewPostListDto> {

    const pageSize= 10;
    const filterParamBuilder = new PagedPostListFilterModelBuilder();
    if (filterDto.currentUserOnly) {
      if (!currentUser)
        throw new CommonUnauthorizedException('Authorized user only');

      filterParamBuilder.withUserId(currentUser.id);
    } else {
      filterParamBuilder.withStatus(PostStatus.ACTIVE);
    }

    const filterParam = filterParamBuilder.withPage(page)
        .withPageSize(pageSize)
        .withTitle(filterDto?.query)
        .withCategory(filterDto?.category)
        .getResult();
    const posts = await this.postService.getPosts(filterParam);

    const postMapper: PostDtoMapper = new PostDtoMapper(this.postImageService, this.userService);
    const resultDto = new PreviewPostListDto();
    resultDto.totalCount = posts.totalCount;
    resultDto.totalPageCount = Math.ceil(resultDto.totalCount / pageSize);
    resultDto.posts = await Promise.all(posts.records.map(post=> postMapper.toPostPreviewDto(post)));

    return resultDto;
  }

  @Get('post-details/:id')
  @ApiOperation({ summary: 'Get post details' })
  @ApiResponse({ status: 200, description: 'Post details.' })
  async getPostDetails(@Param('id') id: number): Promise<PostSummaryDto> {
    if (id < 1)
      throw new CommonBadRequestException('incorrect parameter');

    const post = await this.postService.getById(id);
    if (!post)
      throw new CommonNotfoundException('Post not found');

    return await new PostDtoMapper(this.postImageService, this.userService).toPostSummaryDto(post);
  }
}
