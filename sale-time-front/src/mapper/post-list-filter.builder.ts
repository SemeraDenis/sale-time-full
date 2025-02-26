interface PostListFilter {
    query?: string;
    category?: number;
}

export class PostListFilterBuilder {
    private _filter: PostListFilter;

    constructor() {
        this._filter = {};
    }

    withQuery(q:string): PostListFilterBuilder {
        this._filter.query = q;
        return this;
    }
    withCategory(category:number): PostListFilterBuilder {
        this._filter.category = category;
        return this;
    }

    getResult(){
        return this._filter;
    }
}