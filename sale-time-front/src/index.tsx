// Libraries
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";

// Imports
import App from './app';
import {AuthProvider} from "./context/AuthContext";
import { ThemeProviderWrapper } from "./context/ThemeContext";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <ThemeProviderWrapper>
            <BrowserRouter>
                <AuthProvider>
                    <App/>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProviderWrapper>
    </React.StrictMode>
);
