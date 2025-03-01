// PostActions.tsx
import React from 'react';
import { Button, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import api from '../../services/api';
import ApiRoutes from '../../services/api-routes';
import {PostStatus} from "../../types/post-status";
import {useTranslation} from "react-i18next";


interface PostActionsProps {
    postId: number;
    status: PostStatus;
    fetchPosts: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({ postId, status, fetchPosts }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleStatusChange = async (postId: number, newStatus: PostStatus) => {
        try {
            await api.put(ApiRoutes.PUT_UPDATE_POST_STATUS(postId), { status: newStatus });
            fetchPosts();
        } catch (error) {
            console.error("Ошибка при изменении статуса:", error);
        }
    };


    const handleDelete = async (postId: number) => {
        const isConfirmed = window.confirm(t('post-action.confirm-delete'));
        if (!isConfirmed) return;

        try {
            await api.delete(ApiRoutes.DELETE_POST(postId));
            fetchPosts();
        } catch (error) {
            console.error("Ошибка при изменении статуса:", error);
        }
    };

    return (
        <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
            {status === PostStatus.Inactive && (
                <Button
                    size="small"
                    color="secondary"
                    startIcon={<EditIcon />}
                    onClick={() => handleStatusChange(postId, PostStatus.Active)}
                >
                    {t('post-action.activate')}
                </Button>
            )}
            {status === PostStatus.Active && (
                <Button
                    size="small"
                    color="secondary"
                    startIcon={<EditIcon />}
                    onClick={() => handleStatusChange(postId, PostStatus.Inactive)}
                >
                    {t('post-action.deactivate')}
                </Button>
            )}

            <Button
                size="small"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/edit-post/${postId}`)}
            >
                {t('post-action.edit')}
            </Button>
            <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(postId)}
            >
                {t('post-action.delete')}
            </Button>
        </CardActions>
    );
};

export default PostActions;
