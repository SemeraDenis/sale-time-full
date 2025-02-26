import {Injectable} from "@nestjs/common";
import {PostImageService} from "../post-image.service";
import {Post} from "../../entity/post.entity";
import {PostImage} from "../../entity/post-image.entity";
import {DataSource, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";


@Injectable()
export class DefaultPostImageService implements PostImageService {
    constructor(
        @InjectRepository(PostImage) private readonly postImageRepository: Repository<PostImage>, // <-- Инжектим репозиторий
    ) {}

    async saveImages(post: Post, s3urls: string[]): Promise<void> {
        const imageEntities = s3urls.map(s3url => {
            const entity = new PostImage();
            entity.location = s3url;
            entity.postId = post.id; // Используем id поста
            return entity;
        });

        await this.postImageRepository.save(imageEntities); // Сохраняем сразу все
    }
}