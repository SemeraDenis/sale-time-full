class ApiRoutes {
    static readonly POST_SIGN_IN = "/sign-in";
    static readonly POST_SIGN_UP = "/sign-up";

    static readonly GET_CATEGORIES = `/get-categories`;
    static readonly POST_GET_POST_LIST_PAGED = (page: string | number) => `/get-posts/${page}`;
    static readonly GET_POST_DETAILS = (id: string | number) => `/post-details/${id}`;
    static readonly POST_CREATE = `/protected/posts/create`;
}

export default ApiRoutes;