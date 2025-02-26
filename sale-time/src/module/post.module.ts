import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entity/post.entity';
import { DefaultPostService } from '../service/impl/default-post.service';
import { PostController } from '../api/post.controller';
import { UsersModule } from './user.module';
import { PostCategory } from '../entity/product-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostCategory]), UsersModule],
  providers: [
    {
      provide: 'PostService',
      useClass: DefaultPostService,
    },
    DefaultPostService,
  ],
  controllers: [PostController],
})
export class PostModule {}
