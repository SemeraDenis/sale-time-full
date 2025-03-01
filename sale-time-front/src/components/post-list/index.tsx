import React, {useEffect, useState, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import {useTranslation} from "react-i18next";
import api from "../../services/api";
import { Button, Container, Box, Typography, Stack, Pagination, Card, CardContent, CardActions, Skeleton } from "@mui/material";
import ApiRoutes from "../../services/api-routes";
import {PostListFilterBuilder} from "../../mapper/post-list-filter.builder";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface PostsInfoResponse {
    totalCount: number;
    totalPageCount: number;
    posts: PostInfo[];
}

interface PostInfo {
    id: number;
    status: PostStatus;
    published: Date;
    title: string;
    price: number;
    previewImg: number;
}

enum PostStatus {
    Active = "ACTIVE",
    Inactive = "INACTIVE",
}


interface PostListSectionProps {
    query: string;
    category: number | null;
    currentUserPostsOnly: boolean
}

const PostListSection: React.FC<PostListSectionProps> = ({ query, category, currentUserPostsOnly }) => {
    const [postsInfo, setPostsInfo] = useState<PostsInfoResponse>();
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const fetchPosts = useCallback(() => {
        setLoading(true);
        window.scrollTo({ top: 0, behavior: "smooth" });

        const filterBuilder = new PostListFilterBuilder();

        if (query) filterBuilder.withQuery(query);
        if (category) filterBuilder.withCategory(category);
        if (currentUserPostsOnly != null) filterBuilder.withForCurrentUser(currentUserPostsOnly);

        const filter = filterBuilder.getResult();

        api.post<PostsInfoResponse>(ApiRoutes.POST_GET_POST_LIST_PAGED(`${page}`), filter)
            .then((response) => {
                setPostsInfo(response.data);
                setPageCount(response.data.totalPageCount);
            })
            .catch((error) => console.error("Ошибка загрузки объявлений:", error))
            .finally(() => setLoading(false));
    }, [query, category, currentUserPostsOnly, page]); // Добавляем зависимости

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleStatusChange = async (postId: number, newStatus: PostStatus) => {
        try {
            await api.put(ApiRoutes.PUT_UPDATE_POST_STATUS(postId), { status: newStatus });
            fetchPosts();
        } catch (error) {
            console.error("Ошибка при изменении статуса:", error);
        }
    };
    const handleDelete = async (postId: number) => {
        const isConfirmed = window.confirm(t('post-action.confirm-delete'));
        if (!isConfirmed) return;

        try {
            await api.delete(ApiRoutes.DELETE_POST(postId));
            fetchPosts();
        } catch (error) {
            console.error("Ошибка при изменении статуса:", error);
        }
    };

    return (
        <Container>
            <Box>
                {loading ? (
                    [...Array(5)].map((_, index) => (
                        <Card key={index} variant="outlined">
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Skeleton variant="text" width="60%" height={28} />
                                    <Skeleton variant="text" width="20%" height={24} />
                                </Box>
                                <Skeleton variant="text" width="90%" height={20} sx={{ mt: 1 }} />
                                <Skeleton variant="text" width="80%" height={20} />
                            </CardContent>
                            <CardActions>
                                <Skeleton variant="rectangular" width={80} height={32} />
                            </CardActions>
                        </Card>
                    ))
                ) : (
                    <Stack direction="column" spacing={2}>
                        {postsInfo?.posts.map((post) => (
                            <Card
                                key={post.id}
                                variant="outlined"
                                sx={{ cursor: "pointer" }}>
                                <CardContent
                                    onClick={() => navigate(`/post-details/${post.id}`)}
                                >
                                    <Box display="flex">
                                        {/* Превью изображения */}
                                        {post.previewImg ? (
                                            <Box
                                                component="img"
                                                src={ApiRoutes.GET_POST_IMAGE_URL(post.previewImg)}
                                                alt={post.title}
                                                sx={{
                                                    width: 120,
                                                    height: 100,
                                                    objectFit: "cover",
                                                    borderRadius: 1,
                                                    mr: 2,
                                                }}
                                            />
                                        ) : (
                                            <Skeleton
                                                variant="rectangular"
                                                width={120}
                                                height={100}
                                                sx={{ borderRadius: 1, mr: 2 }}
                                            />
                                        )}

                                        {/* Контент */}
                                        <Box display="flex" flexDirection="column" flex={1} justifyContent="space-between">
                                            {/* Верхний блок: заголовок и цена */}
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                <Typography variant="h6">{post.title}</Typography>
                                                <Typography color="text.secondary">
                                                    {new Intl.NumberFormat("ru-RU").format(post.price)} ₸
                                                </Typography>
                                            </Box>
                                            <Box flexGrow={1} />
                                            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "flex-start", mt: 1 }}>
                                                {new Date(post.published).toLocaleDateString("ru-RU")}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                                {currentUserPostsOnly && (
                                    <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                                        {post.status == PostStatus.Inactive && (
                                            <><Button size="small" color="secondary" startIcon={<EditIcon />} onClick={() => handleStatusChange(post.id, PostStatus.Active)}>{t('post-action.activate')}</Button></>
                                        )}
                                        {post.status == PostStatus.Active && (
                                            <Button size="small" color="secondary" startIcon={<EditIcon />} onClick={() => handleStatusChange(post.id, PostStatus.Inactive)}>{t('post-action.deactivate')}</Button>
                                        )}

                                        <Button size="small" color="primary" startIcon={<EditIcon />} onClick={() => navigate(`/edit-post/${post.id}`)}>{t('post-action.edit')}</Button>
                                        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={()=>handleDelete(post.id)}>{t('post-action.delete')}</Button>
                                    </CardActions>
                                )}
                            </Card>
                        ))}
                    </Stack>
                )}

                {(postsInfo?.totalCount ?? 0) > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                        <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} color="primary" />
                    </Box>
                )}
            </Box>
        </Container>
    );
}


export default PostListSection;