import React from "react";
import { Heading, HeadingLevel } from 'baseui/heading';
import { ParagraphSmall } from 'baseui/typography';

import ManagerSubPage from "../ManagerSubPage";


const ExpenseManager = () => {
    return (
        <ManagerSubPage activeItem={"Expenses"}>
            <HeadingLevel>
                <HeadingLevel>
                 <HeadingLevel>
                    <Heading>Expenses Manager</Heading>
                    <ParagraphSmall>
                        This is where you can manage all your Expense Data!
                    </ParagraphSmall>
                    </HeadingLevel>
                </HeadingLevel>
            </HeadingLevel>
        </ManagerSubPage>
    );
};

export default ExpenseManager;