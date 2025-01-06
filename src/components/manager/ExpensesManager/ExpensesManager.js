import React from "react";
import { Heading, HeadingLevel } from 'baseui/heading';
import { ParagraphSmall } from 'baseui/typography';

import ManagerSubPage from "../ManagerSubPage";


const ExpenseManager = () => {
    return (
        <ManagerSubPage activeItem={"Expenses"} pageTitle={"Expenses Manager"}>
            
        </ManagerSubPage>
    );
};

export default ExpenseManager;