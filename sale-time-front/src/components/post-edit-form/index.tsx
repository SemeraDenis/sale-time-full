import React, { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { useNavigate  } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, IconButton, TextField, Typography, Container, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useTranslation } from "react-i18next";
import ApiRoutes from "../../services/api-routes";
import api from "../../services/api";

interface PostFormData {
    title: string;
    description: string;
    price: number;
}

interface PostFormProps {
    postId: number;
    initialValues: PostFormData;
}

// Валидация
const schema = yup.object({
    title: yup.string().required("Введите название"),
    description: yup.string().required("Введите описание"),
    price: yup.number().typeError("Цена должна быть числом").positive("Цена должна быть положительной").required("Введите цену"),
});



const PostEditForm: React.FC<PostFormProps> = ({ postId, initialValues }) => {
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<PostFormData>({
        resolver: yupResolver(schema) as Resolver<PostFormData>,
        defaultValues: initialValues
    });



    // Обработчик отправки формы
    const onSubmit = async (data: PostFormData) => {
        try{
            const formData = {
                title: data.title,
                description: data.description,
                price: data.price.toString(),
            };

            console.log("Отправка данных", formData);

            await api.put(ApiRoutes.PUT_POST_EDIT(postId), formData);

            navigate(`/post-details/${postId}`);
        }
        catch (error: any){
            const errorDictionary: Record<number, string> = {
                401: "Ошибка авторизации",
            };
            setErrorMessage(errorDictionary[error.response?.status] || "Непредвиденная ошибка");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h4" textAlign="center">{t("create-post-actions.edit-title")}</Typography>

                <TextField
                    label={t("create-post-title")}
                    {...register("title")}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    fullWidth
                />

                <TextField
                    label={t("create-post-description")}
                    multiline
                    rows={4}
                    {...register("description")}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    fullWidth
                />

                <TextField
                    label={t("create-post-price")}
                    type="number"
                    {...register("price")}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    fullWidth
                />


                {errorMessage && (
                    <Typography color="error" textAlign="center">
                        {errorMessage}
                    </Typography>
                )}

                <Button type="submit" variant="contained" color="primary">{t("create-post-actions.do-change")}</Button>
            </Box>
        </Container>
    );
};

export default PostEditForm;
