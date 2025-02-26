import {Injectable} from "@nestjs/common";
import {CategoryService} from "../category.service";
import {PostCategory} from "../../entity/product-category.entity";
import {DataSource, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class DefaultCategoryService implements CategoryService {
    constructor(
        private readonly dataSource: DataSource,

        @InjectRepository(PostCategory)
        private readonly categoryRepository: Repository<PostCategory>,
    ) {}


    async getAll(): Promise<PostCategory[]> {
        return await this.categoryRepository.find();
    }

}