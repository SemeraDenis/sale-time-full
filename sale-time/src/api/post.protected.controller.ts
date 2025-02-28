import { Body, Req, Res, Controller, Inject, Post, Param, Get, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePostRequestDto } from '../dto/create-post.dto';
import { PostService } from '../service/post.service';
import { JwtUserUtils } from '../utils/jwt-user.utils';
import { PagedPostListFilterModelBuilder } from '../model/post-get-filter.model';
import { PostState } from '../entity/post.entity';
import { ChangePostStateRequestDto } from '../dto/change-post-state.dto';

@Controller('protected/posts')
export class PostProtectedController {
  constructor(
    @Inject('PostService') private readonly postService: PostService,
  ) {}

  //Создание поста
  @Post('create')
  @UseInterceptors(FilesInterceptor('images'))
  async create(
      @Body() request: CreatePostRequestDto,
      @UploadedFiles() images: Express.Multer.File[],
      @Req() req: Request,
      @Res() res: Response,
  ): Promise<void> {

    const userId = JwtUserUtils.getUserInfo(req).id;
    await this.postService.create(userId, request, images);

    res.status(201).json({ message: 'Post successfully created' });
  }

  //Изменение статуса поста
  @Post('change-status')
  @ApiOperation({ summary: 'Change post state' })
  @ApiResponse({ status: 200, description: 'Post successfully created.' })
  @ApiBody({
    description: 'Request body for change post state',
    type: ChangePostStateRequestDto,
    examples: {
      example1: {
        summary: 'Valid request',
        value: {
          postId: '35',
          state: PostState.INACTIVE,
        },
      },
    },
  })
  async changeState(
    @Body() request: ChangePostStateRequestDto,
    @Req() req: Request): Promise<void> {

    const userId = JwtUserUtils.getUserInfo(req).id;
    await this.postService.changeState(request.postId, userId, request.state);
  }
}