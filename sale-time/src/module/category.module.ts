import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostCategory} from "../entity/product-category.entity";
import {DefaultCategoryService} from "../service/impl/default-category.service";
import {DictionaryController} from "../api/dictionary.controller";

@Module({
    imports: [TypeOrmModule.forFeature([PostCategory])],
    providers: [
        {
            provide: 'CategoryService',
            useClass: DefaultCategoryService,
        },
        DefaultCategoryService,
    ],
    controllers: [DictionaryController],
    exports: ['CategoryService']
})
export class DictionaryModule {}