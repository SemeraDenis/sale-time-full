import React, { useState } from "react";
import {TextField, Button, Box, InputAdornment, IconButton} from "@mui/material";
import {useTranslation} from "react-i18next";
import {Clear} from "@mui/icons-material";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const { t } = useTranslation();

    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (query.trim()) {
            onSearch(query);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearch();
        }
    };

    const clearSearch = () => {
        setQuery("");
        onSearch("");
    };

    return (
        <Box maxWidth="md" sx={{ mt: 2, mb: 2 }}>
                <Box display="flex" gap={2} paddingTop={2} paddingBottom={2}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label={t("enterSearchText")}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                        slotProps={{
                            input: {
                                endAdornment: query && (
                                    <InputAdornment position="end">
                                        <IconButton onClick={clearSearch} size="small">
                                            <Clear />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Button variant="contained" onClick={handleSearch}>
                        {t("find")}
                    </Button>
                </Box>
        </Box>
    );
};

export default SearchBar;