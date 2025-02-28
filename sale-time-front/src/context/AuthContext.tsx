import React, { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import ApiRoutes from "../services/api-routes";

interface AuthContextType {
    isAuthenticated: boolean;
    user: { fullName: string } | null;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const cookieTitle = process.env.REACT_APP_COOKIE_TOKEN || "st-auth-token";
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<{ fullName: string } | null>(null);
    const location = useLocation();

    useEffect(() => {
        const token = Cookies.get(cookieTitle);
        if (token) {
            const checkUser = async () => {
                const parsedUser = parseToken(token);
                if (parsedUser) {
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                    await fetchUserData(token);
                } else {
                    logout();
                }
            };
            checkUser();
        }
    }, []);

    useEffect(() => {
        const token = Cookies.get(cookieTitle);
        if (token) {
            fetchUserData(token);
        }
    }, [location.pathname]);

    const login = (token: string) => {
        Cookies.set(cookieTitle, token, { secure: true, sameSite: "strict" });

        const parsedUser = parseToken(token);
        if (parsedUser) {
            setUser(parsedUser);
            setIsAuthenticated(true);
            fetchUserData(token);
        } else {
            logout();
        }
    };

    const logout = () => {
        Cookies.remove(cookieTitle);
        setIsAuthenticated(false);
        setUser(null);
    };

    const fetchUserData = async (token: string) => {
        try {
            const response = await api.get(ApiRoutes.VALIDATE_TOKEN, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Ошибка при получении данных пользователя", error);
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const parseToken = (token: string | undefined): { fullName: string } | null => {
    if (!token) return null;

    try {
        const tokenData = jwtDecode<{ fullName: string }>(token);
        return { fullName: tokenData.fullName };
    } catch (e) {
        console.error("Ошибка декодирования токена", e);
        return null;
    }
};
