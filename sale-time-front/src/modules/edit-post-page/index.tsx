import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../header";
import Footer from "../footer";
import api from "../../services/api";
import ApiRoutes from "../../services/api-routes";
import {Box, Container, Skeleton} from "@mui/material";
import PostEditForm from "../../components/post-edit-form";

const EditPostModule: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const postId = Number(id);

    const [initialValues, setInitialValues] = useState(null);

    useEffect(() => {
        api.get(ApiRoutes.GET_POST_DETAILS_FOR_EDIT(`${id}`))
            .then((response) => setInitialValues(response.data))
            .catch((err) => console.error("Ошибка загрузки объявления", err));
    }, [id]);

    return (
        <section>
            <Header />
            {initialValues ? <PostEditForm postId={postId} initialValues={initialValues} /> : (
                <Container>
                    <Box>
                        <Skeleton variant="rectangular" width="100%" height={400} sx={{ mt: 2 }} />
                    </Box>
                </Container>
            )}
            <Footer />
        </section>
    );
};

export default EditPostModule;
