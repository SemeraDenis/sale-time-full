import {Controller, Get, Inject} from "@nestjs/common";
import {CategoryDto} from "../dto/category.dto";
import {CategoryService} from "../service/category.service";

@Controller()
export class DictionaryController {
    constructor(
        @Inject('CategoryService') private readonly categoryService: CategoryService,
    ) {}

    @Get('get-categories')
    async categories():Promise<CategoryDto[]>{
        const categories =  await this.categoryService.getAll();

        return categories.map((value) => {
            const d = new CategoryDto();
            d.id = value.id;
            d.name = value.title;

            return d;
        });
    }
}