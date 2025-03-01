// Libraries
import React, {useState} from "react";
import { Box, Container } from "@mui/material";
import Header from "../header";
import CategorySection from "../../components/categories";
import SearchBar from "../../components/searchbar";
import PostListSection from "../../components/post-list";
import Footer from "../footer";

const MainPageModule: React.FC = () => {
    const [query, setQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
    };

    const handleCategoryChange = (category: number | null) => {
        setSelectedCategory(category);
    };

    return (
        <Box>
            <Header />
            <Container maxWidth="md">
                <SearchBar onSearch={handleSearch} />
                <CategorySection onCategorySelect={handleCategoryChange}/>
                <PostListSection query={query} category={selectedCategory} currentUserPostsOnly={false}/>
            </Container>
            <Footer />
        </Box>
    );
};

export default MainPageModule;
