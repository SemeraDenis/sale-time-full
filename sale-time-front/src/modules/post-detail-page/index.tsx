import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { Box, Container, Typography, CircularProgress, Card, CardContent, Grid } from "@mui/material";
import api from "../../services/api";
import ApiRoutes from "../../services/api-routes";
import Footer from "../footer";
import Header from "../header";
import { useTranslation } from "react-i18next";

interface SellerInfo {
    id: number;
    fullName: string;
    phoneNumber: string;
}
interface PostSummaryInfo {
    id: number;
    published: Date;
    title: string;
    description: string;
    price: number;
    images: number[];
    seller: SellerInfo;
}

const PostDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState<PostSummaryInfo>();
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

    const sliderSettings = {
        dots: true,
        infinite: post.images.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true, // Кнопки "вперед" и "назад"
    };

    return (
        <Box>
            <Header />
            <Container style={{ padding: '25px 0 0' }}>

                <Card>
                    <CardContent>
                        <Typography variant="h4" fontWeight="bold" align="left">
                            {post.title}
                        </Typography>
                    </CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            {post.images && post.images.length > 0 && (
                                <Slider {...sliderSettings}>
                                    {post.images.map((image, index) => (
                                        <Box key={index} sx={{ width: "100%", textAlign: "center" }}>
                                            <img
                                                src={ApiRoutes.GET_POST_IMAGE_URL(image)}
                                                alt={post.title}
                                                style={{
                                                    width: "100%",
                                                    height: "auto",
                                                    maxHeight: "400px",
                                                    objectFit: "contain",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Slider>
                            )}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ mt: 2, p: 2 }}>
                                <CardContent>
                                    <Typography sx={{ fontSize: "0.750rem", color: "gray", padding: "5px 0 5px 0" }}>
                                        {t("published")} {new Date(post.published).toLocaleDateString("ru-RU")}
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        {new Intl.NumberFormat("ru-RU").format(post.price)} ₸
                                    </Typography>
                                </CardContent>
                            </Card>

                            {post.seller && (
                                <Card sx={{ mt: 2, p: 2 }}>
                                    <CardContent>
                                        <Typography sx={{ fontSize: "0.750rem", color: "gray", padding: "5px 0 5px 0" }}>
                                            {t("seller_info")}
                                        </Typography>
                                        <Typography variant="h4">{post.seller.fullName}</Typography>
                                        <Typography variant="h6" color="primary">{post.seller.phoneNumber}</Typography>
                                    </CardContent>
                                </Card>
                            )}
                        </Grid>

                    </Grid>
                </Card>

                <Card sx={{ mt: 2, padding: 2 }}>
                    <CardContent>
                        <Typography variant="h4"><strong>{t("description")}</strong></Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>{post.description}</Typography>
                    </CardContent>
                </Card>
            </Container>
            <Footer />
        </Box>
    );
};

export default PostDetails;
