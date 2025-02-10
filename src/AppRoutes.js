import React from "react";
import { 
    Route, 
    Routes 
} from "react-router-dom";

import Home from "./components/home/Home";
import Manager from "./components/manager/Manager";

import ExpenseManager from "./components/manager/ExpensesManager/ExpensesManager";
import ExpenseTypeManager from "./components/manager/ExpensesManager/ExpenseTypes/ExpenseTypesManager";
import ExpenseTypeDetails from "./components/manager/ExpensesManager/ExpenseTypes/ExpenseTypeDetails";
import ExpenseValuesManager from "./components/manager/ExpensesManager/ExpenseValues/ExpenseValuesManager";

import IncomesManager from "./components/manager/IncomesManager/IncomesManager";
import IncomeTypesManager from "./components/manager/IncomesManager/IncomeTypes/IncomeTypesManager";
import IncomeTypeDetails from "./components/manager/IncomesManager/IncomeTypes/IncomeTypeDetails";
import IncomeValuesManager from "./components/manager/IncomesManager/IncomeValues/IncomeValuesManager";

import {
    MANAGER_PATH, 
    EXPENSES_MANAGER_PATH, EXPENSE_TYPES_MANAGER_PATH, EXPENSE_TYPE_DETAILS_PATH, EXPENSE_VALUES_MANAGER_PATH,
    INCOMES_MANAGER_PATH, INCOME_TYPES_MANAGER_PATH, INCOME_TYPE_DETAILS_PATH, INCOME_VALUES_MANAGER_PATH,
    SAVINGS_MANAGER_PATH, SAVING_TYPES_MANGER_PATH, SAVING_VALUES_MANAGER_PATH
} from "./AppPaths";


const AppRoutes = () => {
   return(
       <Routes>
            <Route path="/" element={ <Home /> } />

            <Route path={MANAGER_PATH} element={ <Manager /> } />

            <Route path={EXPENSES_MANAGER_PATH} element={ <ExpenseManager /> } />
            <Route path={EXPENSE_TYPES_MANAGER_PATH} element={ <ExpenseTypeManager /> } />
            <Route path={EXPENSE_TYPE_DETAILS_PATH} element={ <ExpenseTypeDetails /> } />
            <Route path={EXPENSE_VALUES_MANAGER_PATH} element={ <ExpenseValuesManager /> } />

            <Route path={INCOMES_MANAGER_PATH} element={ <IncomesManager /> } />
            <Route path={INCOME_TYPES_MANAGER_PATH} element={ <IncomeTypesManager /> } />
            <Route path={INCOME_TYPE_DETAILS_PATH} element={ <IncomeTypeDetails /> } />
            <Route path={INCOME_VALUES_MANAGER_PATH} element={ <IncomeValuesManager /> } />

        </Routes>
   )
}

export default AppRoutes;