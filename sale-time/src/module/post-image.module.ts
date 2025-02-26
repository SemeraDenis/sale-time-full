import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostImage } from '../entity/post-image.entity';
import { DefaultPostImageService } from '../service/impl/default-post-image.service';

@Module({
    imports: [TypeOrmModule.forFeature([PostImage])],
    providers: [
        {
            provide: 'PostImageService',
            useClass: DefaultPostImageService,
        },
        DefaultPostImageService,
    ],
    exports: ['PostImageService', TypeOrmModule], // Экспортируем для использования в других модулях
})
export class PostImageModule {}
