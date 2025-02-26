import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Box, Container, Typography, CircularProgress, Card, CardMedia, CardContent, Grid} from "@mui/material";
import api from "../../services/api";
import ApiRoutes from "../../services/api-routes";
import Footer from "../footer";
import Header from "../header";
import {useTranslation} from "react-i18next";

interface PostDetails {
    id: number;
    created: Date;
    title: string;
    description: string;
    price: number;
    images: string[];
}

const PostDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState<PostDetails>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        api.get(ApiRoutes.GET_POST_DETAILS(`${id}`))
            .then((response) => setPost(response.data))
            .catch(() => setError("Ошибка загрузки поста"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!post) return <Typography color="error">Ошибка загрузки поста</Typography>;

    return (
        <Box>
            <Header />
            <Container style={{padding: '25px 0 0'}}>
                <Card>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            {post.images && post.images.length > 0 && (
                                <CardMedia
                                    component="img"
                                    image={post.images[0]}
                                    alt={post.title}
                                    sx={{
                                        width: "100%",
                                        height: "auto",
                                        maxHeight: { xs: "250px", md: "400px" },
                                        objectFit: "contain"
                                    }}
                                />

                            )}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <CardContent>
                                <Typography sx={{ fontSize: "0.750rem", color: "gray", padding:"5px 0 5px 0" }}>{t("published")} {new Date(post.created).toLocaleDateString("ru-RU")}</Typography>
                                <Typography variant="h4">{post.title}</Typography>
                                <Typography variant="h6" color="primary">{new Intl.NumberFormat("ru-RU").format(post.price)} ₸</Typography>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
                <Card sx={{ mt: 2, padding: 2 }}>
                    <CardContent>
                        <Typography variant="h6">{t("description")}</Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>{post.description}</Typography>
                    </CardContent>
                </Card>
            </Container>
            <Footer />
        </Box>
    );
};

export default PostDetails;