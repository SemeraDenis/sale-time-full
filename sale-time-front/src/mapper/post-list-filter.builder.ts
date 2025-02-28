interface PostListFilter {
    query?: string;
    category?: number;
    currentUser: boolean
}

export class PostListFilterBuilder {
    private _filter: PostListFilter;

    constructor() {
        this._filter = {
            currentUser: false
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

    withForCurrentUser(onlyUserPosts:boolean): PostListFilterBuilder {
        this._filter.currentUser = onlyUserPosts;
        return this;
    }

    getResult(){
        return this._filter;
    }
}