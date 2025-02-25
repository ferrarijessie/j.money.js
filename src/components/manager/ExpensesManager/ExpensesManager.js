import React from "react";
import moment from "moment";

import { useNavigate } from "react-router-dom";

import { Tile, StyledParagraph } from "baseui/tile";
import { Skeleton } from "baseui/skeleton";
import { ListHeading, ListItem, ListItemLabel } from "baseui/list";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt, faMoneyBills, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { 
    EXPENSES_MANAGER_PATH, 
    EXPENSE_TYPES_MANAGER_PATH, 
    EXPENSE_VALUES_MANAGER_PATH,
} from "../../../AppPaths";

import { useExpenseTypes } from "../../../hooks/expenseTypes/useExpenseTypes";
import { useExpenses } from "../../../hooks/expenses/useExpenses";
import { useExpensesList } from "../../../hooks/expenses/useExpensesList";

import { TagsContainerUI } from "../common/styled";
import { 
    managerSummaryGridOverrides,
    listHeadingOverrides, 
    listItemOverrides 
} from "../common/overrides";

import ManagerSubPage from "../ManagerSubPage";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";


const ExpenseManager = () => {

    const navigate = useNavigate();

    const {
        isLoading: isTypesLoading, 
        error: typesError, 
        data: typesData = [],
        refetch: reloadTypes
    } = useExpenseTypes();

    const {
        isLoading: isExpensesLoading, 
        error: expensesError, 
        data: expensesData = [],
        refetch: reloadExpenses
    } = useExpenses();

    const {
        isLoading: isExpensesListLoading, 
        error: expensesListError, 
        data: expensesListData = [],
        refetch: reloadExpensesList
    } = useExpensesList(
        'all',
        moment().format('Y'),
        moment().format('M')
    );

    return (
        <ManagerSubPage 
            activeItem={EXPENSES_MANAGER_PATH}
            itemTitle={"Expenses"}
        >  
            <TagsContainerUI>
                {isExpensesLoading && isTypesLoading ?
                    <>
                        <Skeleton
                            rows={0}
                            height="100px"
                            width="200px"
                            animation
                        />
                        <Skeleton
                            rows={0}
                            height="100px"
                            width="200px"
                            animation
                        />
                    </>
                :
                    <>
                        <Tile
                            label="Expense Types"
                            leadingContent={() => <FontAwesomeIcon icon={faReceipt} size="2xl" />}
                            trailingContent={() => <FontAwesomeIcon icon={faChevronRight} />}
                            onClick={() => navigate(EXPENSE_TYPES_MANAGER_PATH)}
                        >
                            <StyledParagraph>{typesData.length}</StyledParagraph>
                        </Tile>
                        <Tile
                            label="Expense Values"
                            leadingContent={() => <FontAwesomeIcon icon={faMoneyBills} size="2xl" />}
                            trailingContent={() => <FontAwesomeIcon icon={faChevronRight} />}
                            onClick={() => navigate(EXPENSE_VALUES_MANAGER_PATH)}
                            >
                            <StyledParagraph>{expensesData.length}</StyledParagraph>
                        </Tile>
                    </>
                }
            </TagsContainerUI>
            
            <FlexGrid flexGridColumnCount={1} {...managerSummaryGridOverrides}>
                <FlexGridItem>
                    <ListHeading 
                        heading="Expenses This Month"
                        endEnhancer={() => `R$ ${expensesListData.reduce((acc, p) => acc + p.value, 0).toFixed(2)}`}
                        {...listHeadingOverrides}
                    />
                    {isExpensesListLoading ?
                        <Skeleton
                        rows={5}
                        height="20px"
                        animation
                    />
                    :
                        (expensesListData.map(expense => 
                                <ListItem
                                    endEnhancer={() => `R$ ${expense.value.toFixed(2)}`}
                                    {...listItemOverrides}
                                >
                                    <ListItemLabel>{expense.typeName}</ListItemLabel>
                                </ListItem>
                        ))
                    }
                </FlexGridItem>
            </FlexGrid>
            
        </ManagerSubPage>
    );
};

export default ExpenseManager;