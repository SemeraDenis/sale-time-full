import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    Box,
    Button,
    CssBaseline,
    Divider,
    FormControl,
    FormLabel,
    Link,
    Stack,
    TextField,
    Typography,
    Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import Header from "../header";
import Footer from "../footer";
import ApiRoutes from "../../services/api-routes";

// Валидация
const schema = yup.object().shape({
    login: yup.string().required("Введите логин"),
    password: yup.string().min(6, "Минимум 6 символов").required("Введите пароль"),
});

// Стили для карточки
const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
        maxWidth: "450px",
    },
    boxShadow:
        "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
    ...theme.applyStyles("dark", {
        boxShadow:
            "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
    }),
}));

const AuthPageModule: React.FC = () => {
    const authContext = React.useContext(AuthContext);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: { login: string; password: string }) => {
        try {
            const response = await api.post(ApiRoutes.POST_SIGN_IN, data);
            const token = response.data.token;
            if (authContext?.login) authContext.login(token);
            navigate("/");
        } catch (error: any) {
            const errorDictionary: Record<number, string> = {
                401: "Неправильный логин или пароль",
                500: "Ошибка сервера",
            };
            setErrorMessage(errorDictionary[error.response?.status] || "Ошибка входа");
        }
    };

    return (
        <section>
            <Header />

            <Box>
                <CssBaseline enableColorScheme />
                <Stack direction="column" justifyContent="center" height="100vh">
                    <Card variant="outlined">
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{ textAlign: "center", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
                        >
                            {t("authPageTitle")}
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleSubmit(onSubmit)}
                            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                        >
                            <FormControl>
                                <FormLabel>{t("login")}</FormLabel>
                                <TextField
                                    type="text"
                                    {...register("login")}
                                    error={!!errors.login}
                                    helperText={errors.login?.message}
                                    fullWidth
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>{t("password")}</FormLabel>
                                <TextField
                                    type="password"
                                    {...register("password")}
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    fullWidth
                                />
                            </FormControl>

                            {errorMessage && (
                                <Typography color="error" textAlign="center">
                                    {errorMessage}
                                </Typography>
                            )}

                            <Button type="submit" variant="contained" fullWidth>
                                {t("doAuth")}
                            </Button>
                        </Box>

                        <Divider>или</Divider>
                        <Box sx={{ textAlign: "center" }}>
                            <Link href="/sign-up" variant="body2">
                                {t("registerQuestion")}
                            </Link>
                        </Box>
                    </Card>
                </Stack>
            </Box>

            <Footer />
        </section>


    );
};

export default AuthPageModule;
