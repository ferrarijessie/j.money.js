import React from "react";
import moment from "moment";

import { useNavigate } from "react-router-dom";

import { Tile, StyledParagraph } from "baseui/tile";
import { Skeleton } from "baseui/skeleton";
import { ListHeading, ListItem, ListItemLabel } from "baseui/list";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt, faMoneyBills, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { 
    INCOMES_MANAGER_PATH, 
    INCOME_TYPES_MANAGER_PATH, 
    INCOME_VALUES_MANAGER_PATH,
} from "../../../AppPaths";

import { useIncomeTypes } from "../../../hooks/incomeTypes/useIncomeTypes";
import { useIncomes } from "../../../hooks/incomes/useIncomes";
import { useIncomesList } from "../../../hooks/incomes/useIncomesList";

import { TagsContainerUI } from "../common/styled";
import { 
    managerSummaryGridOverrides,
    listHeadingOverrides, 
    listItemOverrides 
} from "../common/overrides";

import ManagerSubPage from "../ManagerSubPage";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";


const IncomesManager = () => {

    const navigate = useNavigate();

    const {
        isLoading: isTypesLoading, 
        error: typesError, 
        data: typesData = [],
        refetch: reloadTypes
    } = useIncomeTypes();

    const {
        isLoading: isIncomesLoading, 
        error: incomesError, 
        data: incomesData = [],
        refetch: reloadIncomes
    } = useIncomes();

    const {
        isLoading: isIncomesListLoading, 
        error: incomesListError, 
        data: incomesListData = [],
        refetch: reloadIncomesList
    } = useIncomesList(
        moment().format('Y'),
        moment().format('M')
    );

    return (
        <ManagerSubPage 
            activeItem={INCOMES_MANAGER_PATH}
            itemTitle={"Incomes"}
        >  
            <TagsContainerUI>
                {isIncomesLoading && isTypesLoading ?
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
                            label="Income Types"
                            leadingContent={() => <FontAwesomeIcon icon={faReceipt} size="2xl" />}
                            trailingContent={() => <FontAwesomeIcon icon={faChevronRight} />}
                            onClick={() => navigate(INCOME_TYPES_MANAGER_PATH)}
                        >
                            <StyledParagraph>{typesData.length}</StyledParagraph>
                        </Tile>
                        <Tile
                            label="Income Values"
                            leadingContent={() => <FontAwesomeIcon icon={faMoneyBills} size="2xl" />}
                            trailingContent={() => <FontAwesomeIcon icon={faChevronRight} />}
                            onClick={() => navigate(INCOME_VALUES_MANAGER_PATH)}
                            >
                            <StyledParagraph>{incomesData.length}</StyledParagraph>
                        </Tile>
                    </>
                }
            </TagsContainerUI>
            
            <FlexGrid flexGridColumnCount={1} {...managerSummaryGridOverrides}>
                <FlexGridItem>
                    <ListHeading 
                        heading="Incomes This Month"
                        endEnhancer={() => `R$ ${incomesListData.reduce((acc, p) => acc + p.value, 0).toFixed(2)}`}
                        {...listHeadingOverrides}
                    />
                    {isIncomesListLoading ?
                        <Skeleton
                        rows={5}
                        height="20px"
                        animation
                    />
                    :
                        (incomesListData.map(income => 
                                <ListItem
                                    endEnhancer={() => `R$ ${income.value.toFixed(2)}`}
                                    {...listItemOverrides}
                                >
                                    <ListItemLabel>{income.typeName}</ListItemLabel>
                                </ListItem>
                        ))
                    }
                </FlexGridItem>
            </FlexGrid>
            
        </ManagerSubPage>
    );
};

export default IncomesManager;