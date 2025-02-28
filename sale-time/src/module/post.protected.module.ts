import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entity/post.entity';
import { DefaultPostService } from '../service/impl/default-post.service';
import { PostProtectedController } from '../api/post.protected.controller';
import { UsersModule } from './user.module';
import { PostCategory } from '../entity/product-category.entity';
import {DefaultPostImageService} from "../service/impl/default-post-image.service";
import {PostImageModule} from "./post-image.module";
import {S3Module} from "./s3.module";


@Module({
  imports: [TypeOrmModule.forFeature([Post, PostCategory]), UsersModule, PostImageModule, S3Module],
  providers: [
    {
      provide: 'PostService',
      useClass: DefaultPostService,
    },
    DefaultPostService,
    DefaultPostImageService,
  ],
  controllers: [PostProtectedController],
  exports: ['PostService']
})

export class PostProtectedModule {
}