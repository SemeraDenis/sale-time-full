import React from "react";
import Header from "../header";
import Footer from "../footer";
import PostListSection from "../../components/post-list";
import { Container, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const MyPostsModule: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <Header />
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Box textAlign="left" mb={3}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {t('my_posts.title')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {t('my_posts.description')}
                    </Typography>
                </Box>
                <PostListSection query={""} category={null} currentUserPostsOnly={true} />
            </Container>
            <Footer />
        </>
    );
};

export default MyPostsModule;
