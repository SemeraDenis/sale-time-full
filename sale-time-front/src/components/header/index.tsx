import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { AppBar, Box, Button, Container, Toolbar, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LanguageSwitcher from "../lang-switcher";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const TopSection = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const { toggleTheme, mode } = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    if (!authContext) {
        throw new Error("AuthContext не найден.");
    }

    const { user } = authContext;

    const handleLogout = () => {
        authContext.logout();
        setTimeout(() => navigate("/auth"), 0);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" color="primary">
            <Container>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography
                        variant="h6"
                        component="a"
                        href="/"
                        sx={{ textDecoration: "none", color: "inherit" }}
                    >
                        Sale Time
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <LanguageSwitcher />
                        <IconButton color="inherit" onClick={toggleTheme}>
                            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                        </IconButton>

                        {user ? (
                            <Box
                                onMouseEnter={handleMenuOpen}
                                onMouseLeave={handleMenuClose}
                                sx={{ position: "relative" }}
                            >
                                <Typography
                                    sx={{ cursor: "pointer" }}
                                    onClick={handleMenuOpen}
                                >
                                    {user.username}
                                    <ArrowDropDownIcon sx={{ verticalAlign: "middle" }} />
                                </Typography>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleMenuClose}
                                    sx={{ mt: 1 }}
                                >
                                    <MenuItem disabled>{user.username}</MenuItem>
                                    <MenuItem onClick={() => navigate("/my-posts")}>{t("my-posts")}</MenuItem>
                                    <MenuItem onClick={handleLogout}>{t("logout")}</MenuItem>
                                </Menu>
                            </Box>
                        ) : (
                            <Button variant="contained" color="secondary" onClick={() => navigate("/auth")}>
                                {t("sign-in")}
                            </Button>
                        )}
                        {
                            user ? (
                                    <Button variant="contained" color="secondary" onClick={() => navigate("/create-post")}>
                                        {t("create-post")}
                                    </Button>
                            )
                                : null
                        }

                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default TopSection;
