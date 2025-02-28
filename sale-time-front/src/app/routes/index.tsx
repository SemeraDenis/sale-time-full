import React from "react";
import { Navigate, Route as ReactRoute, Routes as ReactRoutes } from "react-router-dom";

// Pages
import MainPage from "./pages/main-page";
import UIKitsPage from "./pages/ui-kits-page";
import AuthPage from "./pages/auth-page";
import SignUpPage from "./pages/sign-up-page";
import PostDetailsPage from "./pages/post-details";
import CreatePostPage from "./pages/create-post-page";
import MyPostsPage from "./pages/my-posts-page";
import EditPostPage from "./pages/edit-post-page";

// Components
import ProtectedRoute from "./protected-route";

const Routes: React.FC = () => {
    return (
        <ReactRoutes>
            <ReactRoute path="/" element={<MainPage />} />
            <ReactRoute path="/auth" element={<AuthPage />} />
            <ReactRoute path="/sign-up" element={<SignUpPage />} />
            <ReactRoute path="/post-details/:id" element={<PostDetailsPage />} />
            <ReactRoute path="/ui-kits" element={<UIKitsPage />} />

            {/* Защищённые маршруты */}
            <ReactRoute
                path="/create-post"
                element={
                    <ProtectedRoute>
                        <CreatePostPage />
                    </ProtectedRoute>
                }
            />
            <ReactRoute
                path="/edit-post/:id"
                element={
                    <ProtectedRoute>
                        <EditPostPage />
                    </ProtectedRoute>
                }
            />
            <ReactRoute
                path="/my-posts"
                element={
                    <ProtectedRoute>
                        <MyPostsPage />
                    </ProtectedRoute>
                }
            />

            {/* Перенаправление на главную, если путь не найден */}
            <ReactRoute path="*" element={<Navigate to="/" replace />} />
        </ReactRoutes>
    );
};

export default Routes;
