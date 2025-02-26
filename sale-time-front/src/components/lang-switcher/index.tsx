import React from "react";
import {MenuItem, Select, SelectChangeEvent} from "@mui/material";
import i18n from "i18next";

const LanguageSwitcher: React.FC = () => {
    const changeLanguage = (event: SelectChangeEvent<string>) => {
        const newLang = event.target.value as string;
        i18n.changeLanguage(newLang);
        localStorage.setItem("locale", newLang);
    };

    return (
        <Select
            value={i18n.language}
            onChange={changeLanguage}
            size="small"
            sx={{ color: "white", ".MuiSelect-icon": { color: "white" } }}
        >
            <MenuItem value="ru">🇷🇺 Рус</MenuItem>
            <MenuItem value="en">🇺🇸 Eng</MenuItem>
            <MenuItem value="kk">🇰🇿 Қаз</MenuItem>
        </Select>
    );
};

export default LanguageSwitcher;
