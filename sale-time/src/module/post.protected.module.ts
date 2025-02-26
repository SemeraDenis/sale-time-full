import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entity/post.entity';
import { DefaultPostService } from '../service/impl/default-post.service';
import { PostProtectedController } from '../api/post.protected.controller';
import { JwtAuthRequiredMiddleware } from '../middleware/auth-required.middleware';
import { UsersModule } from './user.module';
import { PostCategory } from '../entity/product-category.entity';
import {MinioService} from "../s3/impl/minio.service";
import {DefaultPostImageService} from "../service/impl/default-post-image.service";
import {PostImageModule} from "./post-image.module";


@Module({
  imports: [TypeOrmModule.forFeature([Post, PostCategory]), UsersModule, PostImageModule],
  providers: [
    {
      provide: 'PostService',
      useClass: DefaultPostService,
    },
    DefaultPostService,
    DefaultPostImageService,
    MinioService
  ],
  controllers: [PostProtectedController],
  exports: [MinioService]
})

export class PostProtectedModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthRequiredMiddleware)
      .forRoutes(PostProtectedController);
  }
}