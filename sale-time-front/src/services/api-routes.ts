const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

class ApiRoutes {
    static readonly POST_SIGN_IN = "/sign-in";
    static readonly POST_SIGN_UP = "/sign-up";

    static readonly GET_CATEGORIES = `/get-categories`;
    static readonly POST_GET_POST_LIST_PAGED = (page: string | number) => `/get-posts/${page}`;
    static readonly GET_POST_DETAILS = (id: string | number) => `/post-details/${id}`;
    static readonly POST_CREATE = `/protected/posts/create`;

    static readonly GET_POST_IMAGE_URL =(id: number) => `${API_BASE_URL}/images/post-image/${id}`;
}

export default ApiRoutes;