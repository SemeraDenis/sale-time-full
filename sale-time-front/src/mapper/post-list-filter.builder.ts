interface PostListFilter {
    query?: string;
    category?: number;
    currentUserOnly: boolean
}

export class PostListFilterBuilder {
    private _filter: PostListFilter;

    constructor() {
        this._filter = {
            currentUserOnly: false
        };
    }

    withQuery(q:string): PostListFilterBuilder {
        this._filter.query = q;
        return this;
    }

    withCategory(category:number): PostListFilterBuilder {
        this._filter.category = category;
        return this;
    }

    withForCurrentUser(currentUserOnly:boolean): PostListFilterBuilder {
        this._filter.currentUserOnly = currentUserOnly;
        return this;
    }

    getResult(){
        return this._filter;
    }
}