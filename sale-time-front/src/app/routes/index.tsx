// Libraries
import React from "react";
import {Navigate, Route as ReactRoute, Routes as ReactRoutes} from "react-router-dom";

// Pages
import MainPage from "./pages/main-page";
import UIKitsPage from "./pages/ui-kits-page";
import AuthPage from './pages/auth-page';
import SignUpPage from "./pages/sign-up-page";
import PostDetailsPage from "./pages/post-details";
import CreatePostPage from "./pages/create-post-page";

const routes = [
    {path: '/', element: <MainPage/>},
    {path: '/auth', element: <AuthPage/>},
    {path: '/sign-up', element: <SignUpPage/>},
    {path: '/create-post', element: <CreatePostPage/>},
    {path: '/post-details/:id', element: <PostDetailsPage/>},
    {path: '/ui-kits', element: <UIKitsPage/>},
    {path: '*', element: <Navigate to="/" replace/>}
];

const Routes: React.FC = () => {
    return (
        <ReactRoutes>
            {routes.map(route => (
                <ReactRoute key={route.path} path={route.path} element={route.element}/>
            ))}
        </ReactRoutes>
    );
};

export default Routes;
