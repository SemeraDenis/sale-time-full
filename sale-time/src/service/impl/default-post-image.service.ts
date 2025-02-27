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

    //Сохранение данных о загруженном файле в хранилище S3
    async saveImagesInfo(post: Post, s3FileKey: string, mimeType: string, size: number): Promise<void> {
        const entity = new PostImage();
        entity.location = s3FileKey;
        entity.mimeType = mimeType;
        entity.size = size;
        entity.postId = post.id; // id поста, к которому относится файл

        await this.postImageRepository.save(entity);
    }

    //Получение информации о всех файлах поста
    async getPostImagesInfo(post: Post): Promise<PostImage[]> {
        return await this.postImageRepository.find({ where: { postId: post.id } });
    }

    //Получение информации о файле
    async getImageInfo(postImageId: number): Promise<PostImage> {
        if (!postImageId)
            throw new CommonNotfoundException('Incorrect params');

        const info = await this.postImageRepository.findOne({ where: { id: postImageId } });
        if (!info)
            throw new CommonNotfoundException('Image not found');

        return info;
    }
}