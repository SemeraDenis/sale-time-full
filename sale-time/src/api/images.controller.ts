import { Response } from 'express';
import {Controller, Get, Inject, Param, Res} from "@nestjs/common";
import {PostImageService} from "../service/post-image.service";
import {S3Service} from "../s3/s3.service";

@Controller('images')
export class ImagesController {
    constructor(
        @Inject('PostImageService') private readonly postImageService: PostImageService,
        @Inject('S3Service') private readonly s3Service: S3Service,
    ) {}

    @Get('post-image/:id')
    async getPostImage(@Param('id') id: number,
                       @Res() res: Response):Promise<void>{
        const postImage = await this.postImageService.getImageInfo(id);
        await this.s3Service.downloadFile(postImage.location, res);
    }
}