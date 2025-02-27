import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostImage } from '../entity/post-image.entity';
import { DefaultPostImageService } from '../service/impl/default-post-image.service';
import { ImagesController } from '../api/images.controller';
import { S3Module } from "./s3.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([PostImage]),
        S3Module],
    providers: [
        {
            provide: 'PostImageService',
            useClass: DefaultPostImageService,
        },
        DefaultPostImageService,
    ],
    controllers: [ImagesController],
    exports: ['PostImageService', TypeOrmModule, DefaultPostImageService],
})
export class PostImageModule {}
