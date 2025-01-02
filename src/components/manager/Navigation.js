import React from "react";
import { useNavigate } from 'react-router-dom';

import {
    AppNavBar,
    setItemActive
} from "baseui/app-nav-bar";

import UserItems from "../common/UserItems";

import { 
    EXPENSES_MANAGER_PATH, EXPENSE_TYPES_MANAGER_PATH, EXPENSE_VALUES_MANAGER_PATH,
    INCOMES_MANAGER_PATH, INCOME_TYPES_MANAGER_PATH,
    SAVINGS_MANAGER_PATH, SAVING_TYPES_MANGER_PATH, SAVING_VALUES_MANAGER_PATH
 } from "../../AppPaths";


const Navigation = ({
    activeItem = null,
    activeSubItem = null
}) => {
    const navigate = useNavigate();

    const [mainItems, setMainItems] = React.useState([
        {
          label: "Expenses",
          active: activeItem === "Expenses",
          url: `${EXPENSES_MANAGER_PATH}`,
          children: [
            {
                label: "Expense Types",
                active: activeSubItem === "Expense Types",
                url: `${EXPENSE_TYPES_MANAGER_PATH}`,
            },
            {
                label: 'Expense Values',
                active: activeSubItem === "Expense Values",
                url: `${EXPENSE_VALUES_MANAGER_PATH}`,
            }
          ]
        },
        {
            label: "Incomes",
            active: activeItem === "Incomes",
            url: `${INCOMES_MANAGER_PATH}`,
            children: [
              {
                label: "Income Types",
                active: activeSubItem === "Income Types",
                url: `${INCOME_TYPES_MANAGER_PATH}`,
              },
              {
                label: "Income Values",
                active: activeSubItem === "Income Values",
                url: '/manager/income/values',
              }
            ]
        },
        {
            label: "Savings",
            active: activeItem === "Savings",
            url: `${SAVINGS_MANAGER_PATH}`,
            children: [
              {
                label: "Saving Types",
                active: activeSubItem === "Saving Types",
                url: `${SAVING_TYPES_MANGER_PATH}`,
              },
              {
                label: "Saving Values",
                active: activeSubItem === "Saving Values",
                url: `${SAVING_VALUES_MANAGER_PATH}`,
              }
            ]
        }
    ]);

    const onItemSelect = (item) => {
        setMainItems(prev => setItemActive(prev, item));
        navigate(item?.['url']);
    };

    return (
        <AppNavBar
            title="Finances Management"
            username="Jessica Ferrari"
            usernameSubtitle="the creator"
            mainItems={mainItems}
            onMainItemSelect={item => onItemSelect(item)}
            userItems={UserItems()}
            onUserItemSelect={item => navigate(item.url)}
        />
    );
};

export default Navigation;