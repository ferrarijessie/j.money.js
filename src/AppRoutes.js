import React from "react";
import { 
    Route, 
    Routes 
} from "react-router-dom";

import Home from "./components/home/Home";
import Manager from "./components/manager/Manager";
import ExpenseManager from "./components/manager/ExpensesManager/ExpensesManager";

import {
    MANAGER_PATH, 
    EXPENSES_MANAGER_PATH, EXPENSE_TYPES_MANAGER_PATH, 
    INCOMES_MANAGER_PATH, INCOME_TYPES_MANAGER_PATH, 
    SAVINGS_MANAGER_PATH, SAVING_TYPES_MANGER_PATH, SAVING_VALUES_MANAGER_PATH
} from "./AppPaths";


const AppRoutes = () => {
   return(
       <Routes>
            <Route path="/" element={ <Home /> } />

            <Route path={MANAGER_PATH} element={ <Manager /> } />

            <Route path={EXPENSES_MANAGER_PATH} element={ <ExpenseManager /> } />
        </Routes>
   )
}

export default AppRoutes;