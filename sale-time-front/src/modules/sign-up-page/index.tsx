// Libraries
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Box, Typography, Container, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Header from "../header";
import ApiRoutes from "../../services/api-routes";

// Валидация с помощью yup
const schema = yup.object().shape({
    fullName: yup.string().required("Введите Имя"),
    email: yup.string().email("Заполните email").required("Заполните email"),
    phone: yup.string().min(4, "Минимум 11 символов").required("Заполните номер телефона"),
    login: yup.string().min(4, "Минимум 4 символа").matches(/^[a-zA-Z0-9]+$/, "Только латинские буквы и цифры").required("Введите логин"),
    password: yup.string().min(6, "Минимум 6 символов").required("Введите пароль"),
    confirmPassword: yup.string()
        .oneOf([yup.ref("password"), undefined], "Пароли должны совпадать")
        .required("Подтвердите пароль"),
});

const RegisterPageModule: React.FC = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: { fullName: string; login: string; password: string; email: string; phone: string }) => {
        try {
            const response = await api.post(ApiRoutes.POST_SIGN_UP, {
                login: data.login,
                password: data.password,
                fullName: data.fullName,
                email: data.email,
                phone: data.phone
            });

            const token = response.data.token;
            if (authContext?.login) {
                authContext.login(token);
            }

            navigate("/");
        } catch (error: any) {
            const errorMessage = errorDictionary[error.response?.status] || "Непредвиденная ошибка";
            setErrorMessage(errorMessage);
            console.error(errorMessage, error);
        }
    };

    const errorDictionary: Record<number, string> = {
        409: "Логин уже занят",
        500: "Ошибка сервера",
    };

    return (
        <Box>
            <Header />
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4, mt: 5, borderRadius: 2 }}>
                    <Typography variant="h4" textAlign="center" sx={{ mb: 2 }}>
                        {t("registerPageTitle")}
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label={t("fullName")}
                            {...register("fullName")}
                            error={!!errors.fullName}
                            helperText={errors.fullName?.message}
                        />

                        <TextField
                            label={t("login")}
                            {...register("login")}
                            error={!!errors.login}
                            helperText={errors.login?.message}
                        />

                        <TextField
                            label={t("email")}
                            {...register("email")}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        <TextField
                            label={t("phone")}
                            {...register("phone")}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />

                        <TextField
                            label={t("password")}
                            type="password"
                            {...register("password")}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />

                        <TextField
                            label={t("confirmPassword")}
                            type="password"
                            {...register("confirmPassword")}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                        />

                        {errorMessage && (
                            <Typography color="error" textAlign="center">
                                {errorMessage}
                            </Typography>
                        )}

                        <Button type="submit" variant="contained" fullWidth>
                            {t("doRegister")}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default RegisterPageModule;
