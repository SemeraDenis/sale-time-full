import React from 'react';
import {Box, Divider, FormLabel} from "@mui/material";

const Footer = () =>{
    return (<div className="container">
            <Divider style={{padding:'10px 0 50px'}}></Divider>
            <Box style={{padding: '50px 0 25px'}}
                display="flex"
                justifyContent="center">
                <FormLabel>Проектная работа Семера Д.А.</FormLabel >
            </Box>
        </div>
    )
}

export default Footer;