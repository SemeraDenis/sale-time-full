import {PostCategory} from "../entity/product-category.entity";

export interface CategoryService {
    getAll(): Promise<PostCategory[]>;
    getByIds(ids:number[]): Promise<PostCategory[]>;
}