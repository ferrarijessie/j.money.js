import React from "react";

import { useNavigate } from 'react-router-dom';

import { DarkTheme, ThemeProvider } from "baseui";
import { AppNavBar } from "baseui/app-nav-bar";

import UserItems from "../common/UserItems";


const AppNavigation = () => {
    const navigate = useNavigate();
    
    return (
        <ThemeProvider theme={DarkTheme}>
            <AppNavBar
                title="j.Money"
                username="Jessica Ferrari"
                usernameSubtitle="the creator"
                userItems={UserItems()}
                onUserItemSelect={item => navigate(item.url)}
            />
        </ThemeProvider>
        
    );
};

export default AppNavigation;