export class PagedPostListFilterModel {
  page: number;
  pageSize: number;
  title: string;
  userId: number;
  category: number;
}

export class PagedPostListFilterModelBuilder{
  private model:PagedPostListFilterModel;

  constructor() {
    this.model = new PagedPostListFilterModel();
    this.model.page = 1;
    this.model.pageSize = 10;
  }

  withPage(page?: number): PagedPostListFilterModelBuilder {
    if (page && page > 0)
      this.model.page = page;

    return this;
  }

  withPageSize(pageSize: number): PagedPostListFilterModelBuilder {
    if (pageSize > 0) {
      this.model.pageSize = pageSize;
    }

    return this;
  }

  withTitle(title?: string): PagedPostListFilterModelBuilder {
    if (title && title.length > 0) {
      this.model.title = title;
    }

    return this;
  }

  withCategory(category?: number): PagedPostListFilterModelBuilder {
    if (category && category > 0) {
      this.model.category = category;
    }

    return this;
  }

  withUserId(id: number): PagedPostListFilterModelBuilder {
    if (id > 0){
      this.model.userId = id;
    }

    return this;
  }


  getResult():PagedPostListFilterModel {
    return this.model;
  }
}