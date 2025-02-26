import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {useTranslation} from "react-i18next";
import api from "../../services/api";
import { Button, Container, Box, Typography, Stack, Pagination, Card, CardContent, CardActions, Skeleton } from "@mui/material";
import ApiRoutes from "../../services/api-routes";
import {PostListFilterBuilder} from "../../mapper/post-list-filter.builder";

interface PostsInfoResponse {
    totalCount: number;
    totalPageCount: number;
    posts: PostInfo[];
}

interface PostInfo {
    id: number;
    published: Date;
    title: string;
    description: string;
    price: number;
    previewUrl: string;
}

interface PostListSectionProps {
    query: string;
    category: number | null;
}

const PostListSection: React.FC<PostListSectionProps> = ({ query, category }) => {
    const [postsInfo, setPostsInfo] = useState<PostsInfoResponse>();
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        const filterBuilder = new PostListFilterBuilder();
        if (query) {
            filterBuilder.withQuery(query);
        }

        if (category){
            filterBuilder.withCategory(category);
        }

        const filter = filterBuilder.getResult();
        api.post<PostsInfoResponse>(ApiRoutes.POST_GET_POST_LIST_PAGED(`${page}`), filter)
            .then(
                (response) => {
                    setPostsInfo(response.data);
                    setPageCount(response.data.totalPageCount);
                }
            )
            .catch((error) => console.error("Ошибка загрузки объявлений:", error))
            .finally(() => setLoading(false));
    }, [page, query, category]);

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
                                onClick={() => navigate(`/post-details/${post.id}`)}
                                sx={{ cursor: "pointer" }}>
                                <CardContent>
                                    <Box display="flex">
                                        {/* Превью изображения */}
                                        <Box
                                            component="img"
                                            src={post.previewUrl}
                                            alt={post.title}
                                            sx={{
                                                width: 120,
                                                height: 100,
                                                objectFit: "cover",
                                                borderRadius: 1,
                                                mr: 2,
                                            }}
                                        />

                                        {/* Контент */}
                                        <Box display="flex" flexDirection="column" flex={1} justifyContent="space-between">
                                            {/* Верхний блок: заголовок и цена */}
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                <Typography variant="h6">{post.title}</Typography>
                                                <Typography color="text.secondary">
                                                    {new Intl.NumberFormat("ru-RU").format(post.price)} ₸
                                                </Typography>
                                            </Box>

                                            {/* Растягивающийся контейнер, чтобы дата ушла вниз */}
                                            <Box flexGrow={1} />


                                            {/* Нижний блок: дата создания */}
                                            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "flex-start", mt: 1 }}>
                                                {new Date(post.published).toLocaleDateString("ru-RU")}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                )}

                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} color="primary" />
                </Box>
            </Box>
        </Container>
    );
}


export default PostListSection;