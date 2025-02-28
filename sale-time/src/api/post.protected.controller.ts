import {
  Body,
  Req,
  Res,
  Controller,
  Inject,
  Post,
  Param,
  Get,
  UseInterceptors,
  UploadedFiles,
  Put
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePostRequestDto } from '../dto/create-post.dto';
import { PostService } from '../service/post.service';
import { JwtUserUtils } from '../utils/jwt-user.utils';
import { PostState } from '../entity/post.entity';
import { ChangePostStateRequestDto } from '../dto/change-post-state.dto';
import {ChangePostRequestDto, PostEditableDataInfoDto} from "../dto/get-post-list.dto";

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

  @Get('getPostForEdit/:id')
  async getPostForEdit(
      @Param('id') id: number,
      @Req() req: Request):Promise<PostEditableDataInfoDto>{

    const currentUserId = JwtUserUtils.getUserInfo(req).id;
    const post = await this.postService.findPostForOwner(id, currentUserId);

    const resultDto = new PostEditableDataInfoDto();
    resultDto.price = post.price;
    resultDto.title = post.title;
    resultDto.description = post.description;
    resultDto.category = post.categoryId;

    return resultDto;
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update post details' })
  @ApiResponse({ status: 200, description: 'Post successfully updated.' })
  async updatePost(
      @Param('id') id: number,
      @Body() updateDto: ChangePostRequestDto,
      @Req() req: Request,
  ){
    const currentUserId = JwtUserUtils.getUserInfo(req).id;
    await this.postService.updatePost(id, currentUserId, updateDto);
  }

  //Изменение статуса поста
  @Post('change-status')
  @ApiOperation({ summary: 'Change post state' })
  @ApiResponse({ status: 200, description: 'Post successfully created.' })
  async changeState(
    @Body() request: ChangePostStateRequestDto,
    @Req() req: Request): Promise<void> {

    const userId = JwtUserUtils.getUserInfo(req).id;
    await this.postService.changeState(request.postId, userId, request.state);
  }
}