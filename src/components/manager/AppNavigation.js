import React from "react";

import { useNavigate } from 'react-router-dom';

import { AppNavBar } from "baseui/app-nav-bar";

import UserItems from "../common/UserItems";


const AppNavigation = () => {
    const navigate = useNavigate();
    
    return (
        <AppNavBar
            title="Finances Management"
            username="Jessica Ferrari"
            usernameSubtitle="the creator"
            userItems={UserItems()}
            onUserItemSelect={item => navigate(item.url)}
        />
    );
};

export default AppNavigation;