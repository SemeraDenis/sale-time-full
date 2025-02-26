import React, {createContext, useState} from 'react';
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

interface AuthContextType {
    isAuthenticated: boolean;
    user: { username: string } | null;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const token = Cookies.get("token");
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

    const [user, setUser] = useState<{ username: string } | null>(() => parseToken(token));

    const login = (token: string) => {
        Cookies.set("token", token, { secure: true, sameSite: "strict" });

        setUser(parseToken(token));
        setIsAuthenticated(true);
    };

    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


const parseToken = (token: string | undefined): { username: string } | null => {
    if (!token) return null;

    try {
        const tokenData = jwtDecode<{ fullName: string }>(token); // ✅ Используем безопасное декодирование
        return { username: tokenData.fullName };
    } catch (e) {
        console.error("Ошибка декодирования токена", e);
        return null;
    }
};
