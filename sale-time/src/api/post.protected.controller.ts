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
  Put, Delete, UseGuards
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePostRequestDto } from '../dto/create-post.dto';
import { PostService } from '../service/post.service';
import {ChangePostRequestDto, ChangeStatusPostRequestDto, PostEditableDataInfoDto} from "../dto/get-post-list.dto";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {JwtUserInfo} from "../model/jwt-user-info.model";
import {CurrentUser} from "../auth/current-user.decorator";

@Controller('protected/posts')
export class PostProtectedController {
  constructor(
    @Inject('PostService') private readonly postService: PostService,
  ) {}

  //Создание поста
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async create(
      @Body() request: CreatePostRequestDto,
      @UploadedFiles() images: Express.Multer.File[],
      @CurrentUser() currentUser: JwtUserInfo,
      @Res() res: Response,
  ): Promise<void> {

    await this.postService.create(currentUser.id, request, images);

    res.status(201).json({ message: 'Post successfully created' });
  }

  @Get('getPostForEdit/:id')
  @UseGuards(JwtAuthGuard)
  async getPostForEdit(
      @Param('id') id: number,
      @CurrentUser() currentUser: JwtUserInfo):Promise<PostEditableDataInfoDto>{

    const post = await this.postService.findPostForOwner(id, currentUser.id);

    const resultDto = new PostEditableDataInfoDto();
    resultDto.price = post.price;
    resultDto.title = post.title;
    resultDto.description = post.description;
    resultDto.category = post.categoryId;

    return resultDto;
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update post details' })
  @ApiResponse({ status: 200, description: 'Post successfully updated.' })
  async updatePost(
      @Param('id') id: number,
      @Body() updateDto: ChangePostRequestDto,
      @CurrentUser() currentUser: JwtUserInfo,
  ){
    await this.postService.updatePost(id, currentUser.id, updateDto);
  }

  //Изменение статуса поста
  @Put('change-status/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change post state' })
  @ApiResponse({ status: 200, description: 'Status successfully changed.' })
  async changeState(
      @Param('id') id: number,
      @Body() dto: ChangeStatusPostRequestDto,
      @CurrentUser() currentUser: JwtUserInfo,): Promise<void> {

    await this.postService.changeStatus(id, currentUser.id, dto.status);
  }

  //Удаление поста
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: 200, description: 'Post successfully deleted.' })
  async deletePost(
      @Param('id') id: number,
      @CurrentUser() currentUser: JwtUserInfo): Promise<void> {

    await this.postService.delete(id, currentUser.id);
  }
}