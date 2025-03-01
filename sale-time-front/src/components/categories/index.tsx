import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Button, Container, Box, CircularProgress, Stack } from "@mui/material";
import ApiRoutes from "../../services/api-routes";
import {useTranslation} from "react-i18next";

interface Category {
    id: number;
    name: string;
}

interface CategorySectionProps {
    onCategorySelect: (category: number | null) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ onCategorySelect }) => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<Category[]>(ApiRoutes.GET_CATEGORIES)
            .then((response) => setCategories(response.data))
            .catch((error) => console.error("Ошибка загрузки категорий:", error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Container>
            <Box sx={{ py: 5 }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                        <Button variant="contained" size="large" onClick={() => onCategorySelect(null)}>
                            {t('all-categories')}
                        </Button>
                        {categories.map((category) => (
                            <Button key={category.id} variant="outlined" size="large" onClick={() => onCategorySelect(category.id)}>
                                {category.name}
                            </Button>
                        ))}
                    </Stack>
                )}
            </Box>
        </Container>
    );
};

export default CategorySection;