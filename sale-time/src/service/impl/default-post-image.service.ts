import {Injectable} from "@nestjs/common";
import {PostImageService} from "../post-image.service";
import {Post} from "../../entity/post.entity";
import {PostImage} from "../../entity/post-image.entity";
import {DataSource, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {CommonNotfoundException} from "../../errors/exceptions/common.notfound-exception";


@Injectable()
export class DefaultPostImageService implements PostImageService {
    constructor(
        @InjectRepository(PostImage) private readonly postImageRepository: Repository<PostImage>, // <-- Инжектим репозиторий
    ) {}

    async saveImagesInfo(post: Post, s3urls: string[]): Promise<void> {
        const imageEntities = s3urls.map(s3url => {
            const entity = new PostImage();
            entity.location = s3url;
            entity.postId = post.id; // Используем id поста
            return entity;
        });

        await this.postImageRepository.save(imageEntities); // Сохраняем сразу все
    }



    async getImageInfo(postImageId: number): Promise<PostImage> {
        if (!postImageId)
            throw new CommonNotfoundException('Incorrect params');

        const info = await this.postImageRepository.findOne({ where: { id: postImageId } });
        if (!info)
            throw new CommonNotfoundException('Image not found');

        return info;
    }

    async getAllImageInfo(post: Post): Promise<PostImage[]> {
        return  await this.postImageRepository.find({ where: { postId: post.id } });
    }
}