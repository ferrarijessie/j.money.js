import React from "react";

import { EXPENSES_MANAGER_PATH } from "../../../AppPaths";

import ManagerSubPage from "../ManagerSubPage";


const ExpenseManager = () => {
    return (
        <ManagerSubPage 
            activeItem={EXPENSES_MANAGER_PATH}
            itemTitle={"Expenses"}
        >
            
        </ManagerSubPage>
    );
};

export default ExpenseManager;