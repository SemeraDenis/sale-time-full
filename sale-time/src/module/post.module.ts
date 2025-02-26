import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entity/post.entity';
import { PostCategory } from '../entity/product-category.entity';
import { DefaultPostService } from '../service/impl/default-post.service';
import { PostController } from '../api/post.controller';
import { UsersModule } from './user.module';

import {DictionaryModule} from "./category.module";
import {DefaultPostImageService} from "../service/impl/default-post-image.service";
import {MinioService} from "../s3/impl/minio.service";
import {PostImageModule} from "./post-image.module";


@Module({
  imports: [TypeOrmModule.forFeature([Post, PostCategory]),
    UsersModule,
    DictionaryModule,
    PostImageModule],
  providers: [
    {
      provide: 'PostService',
      useClass: DefaultPostService,
    },
    DefaultPostService,
    DefaultPostImageService,
    MinioService
  ],
  controllers: [PostController],
  exports: [DefaultPostService],
})
export class PostModule {}
