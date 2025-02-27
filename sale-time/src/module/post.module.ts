import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entity/post.entity';
import { PostCategory } from '../entity/product-category.entity';
import { DefaultPostService } from '../service/impl/default-post.service';
import { PostController } from '../api/post.controller';
import { UsersModule } from './user.module';

import {DictionaryModule} from "./category.module";
import {DefaultPostImageService} from "../service/impl/default-post-image.service";
import {PostImageModule} from "./post-image.module";
import {S3Module} from "./s3.module";


@Module({
  imports: [TypeOrmModule.forFeature([Post, PostCategory]),
    UsersModule,
    DictionaryModule,
    PostImageModule,
    S3Module],
  providers: [
    {
      provide: 'PostService',
      useClass: DefaultPostService,
    },
    DefaultPostService,
    DefaultPostImageService,
  ],
  controllers: [PostController],
  exports: [DefaultPostService],
})
export class PostModule {}
