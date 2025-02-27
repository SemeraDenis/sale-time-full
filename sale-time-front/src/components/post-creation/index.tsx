import React, { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { useNavigate  } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, IconButton, TextField, Typography, Container, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import ApiRoutes from "../../services/api-routes";
import api from "../../services/api";

interface Category {
    id: number;
    name: string;
}

interface PostFormData {
    title: string;
    description: string;
    price: number;
    images: (File | null)[];
    category: number;
}

// Валидация
const schema = yup.object({
    title: yup.string().required("Введите название"),
    description: yup.string().required("Введите описание"),
    price: yup.number().typeError("Цена должна быть числом").positive("Цена должна быть положительной").required("Введите цену"),
    images: yup.array()
        .of(yup.mixed<File>().nullable()) // Просто mixed, без required()
        .min(1, "Добавьте хотя бы одно фото")
        .max(5, "Можно загрузить не более 5 фото")
        .required("Файл обязателен"), // Указываем required на весь массив

    category: yup.number().required("Выберите категорию"),
});



const PostCreateForm = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedImages, setSelectedImages] = useState<(File | null)[]>(Array(5).fill(null));
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get<Category[]>(ApiRoutes.GET_CATEGORIES)
            .then((response) => setCategories(response.data))
            .catch((err) => console.error("Ошибка загрузки категорий", err));
    }, []);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<PostFormData>({
        resolver: yupResolver(schema) as Resolver<PostFormData>,
    });


    // Обработчик загрузки фото в конкретный слот
    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const newImages = [...selectedImages];
        newImages[index] = e.target.files[0]; // Обновляем только одно изображение
        setSelectedImages(newImages);
        setValue("images", newImages, { shouldValidate: true }); // Передаем массив фиксированной длины
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...selectedImages];
        newImages[index] = null; // Очищаем слот
        setSelectedImages(newImages);
        setValue("images", newImages, { shouldValidate: true }); // Передаем массив фиксированной длины
    };

    // Обработчик отправки формы
    const onSubmit = async (data: PostFormData) => {
        try{
            const formData = new FormData();

            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("price", data.price.toString());
            formData.append("category", data.category.toString());

            data.images.forEach((file, index) => {
                if (file) {

                    formData.append(`images`, file); // Если сервер поддерживает массив файлов
                }
            });

            console.log("Отправка данных", formData);

            await api.post(ApiRoutes.POST_CREATE, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            navigate("/");
        }
        catch (error: any){
            const errorDictionary: Record<number, string> = {
                401: "Ошибка авторизации",
                500: "Ошибка сервера",
            };
            setErrorMessage(errorDictionary[error.response?.status] || "Ошибка входа");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                 sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h4" textAlign="center">Создание объявления</Typography>

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

                <FormControl fullWidth>
                    <InputLabel>{t("create-post-category")}</InputLabel>
                    <Select {...register("category")} error={!!errors.category}>
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {errors.category && <Typography color="error">{errors.category.message}</Typography>}

                {/* Контейнеры для загрузки фото */}
                <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
                    {selectedImages.map((file, index) => (
                        <Box key={index} sx={{
                            width: 100, height: 100, border: "2px dashed gray", borderRadius: 4, display: "flex",
                            alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
                            cursor: "pointer", backgroundColor: file ? "transparent" : "#f0f0f0"
                        }}>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ opacity: 0, width: "100%", height: "100%", position: "absolute", cursor: "pointer" }}
                                onChange={(e) => handleFileChange(index, e)}
                            />
                            {file ? (
                                <>
                                    <img src={URL.createObjectURL(file)} alt={`preview-${index}`} width="100%" height="100%" style={{ objectFit: "cover" }} />
                                    <IconButton
                                        size="small"
                                        sx={{ position: "absolute", top: 2, right: 2, backgroundColor: "rgba(255, 255, 255, 0.7)" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveImage(index);
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </>
                            ) : (
                                <Typography variant="caption" color="gray">+</Typography>
                            )}
                        </Box>
                    ))}
                </Box>
                {errors.images && <Typography color="error">{errors.images.message}</Typography>}

                {errorMessage && (
                    <Typography color="error" textAlign="center">
                        {errorMessage}
                    </Typography>
                )}
                <Button type="submit" variant="contained" color="primary">{t("create-post-do-create")}</Button>
            </Box>
        </Container>
    );
};

export default PostCreateForm;
