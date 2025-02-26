import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entity/post.entity';
import { DefaultPostService } from '../service/impl/default-post.service';
import { PostProtectedController } from '../api/post.protected.controller';
import { JwtAuthRequiredMiddleware } from '../middleware/auth-required.middleware';
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
  controllers: [PostProtectedController],
})

export class PostProtectedModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthRequiredMiddleware)
      .forRoutes(PostProtectedController);
  }
}