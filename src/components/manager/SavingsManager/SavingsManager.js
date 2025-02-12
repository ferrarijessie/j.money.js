import React from "react";
import moment from "moment";

import { useNavigate } from "react-router-dom";

import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Tile, StyledParagraph } from "baseui/tile";
import { Skeleton } from "baseui/skeleton";
import { ListHeading, ListItem, ListItemLabel } from "baseui/list";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt, faMoneyBills, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { 
    SAVINGS_MANAGER_PATH, 
    SAVING_TYPES_MANGER_PATH, 
    SAVING_VALUES_MANAGER_PATH,
} from "../../../AppPaths";

import { useSavingTypes } from "../../../hooks/savingTypes/useSavingTypes";
import { useSavings } from "../../../hooks/savings/useSavings";
import { useSavingsList } from "../../../hooks/savings/useSavingsList";

import { TagsContainerUI } from "../common/styled";
import { 
    managerSummaryGridOverrides,
    listHeadingOverrides, 
    listItemOverrides 
} from "../common/overrides";

import ManagerSubPage from "../ManagerSubPage";


const SavingsManager = () => {

    const navigate = useNavigate();

    const {
        isLoading: isTypesLoading, 
        error: typesError, 
        data: typesData = [],
        refetch: reloadTypes
    } = useSavingTypes();

    const {
        isLoading: isSavingsLoading, 
        error: incomesError, 
        data: savingsData = [],
        refetch: reloadSavings
    } = useSavings();

    const {
        isLoading: isSavingsListLoading, 
        error: savingsListError, 
        data: savingsListData = [],
        refetch: reloadSavingsList
    } = useSavingsList(
        moment().format('Y'),
        moment().format('M')
    );

    return (
        <ManagerSubPage 
            activeItem={SAVINGS_MANAGER_PATH}
            itemTitle={"Savings"}
        >  
            <TagsContainerUI>
                {isSavingsLoading && isTypesLoading ?
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
                            label="Saving Types"
                            leadingContent={() => <FontAwesomeIcon icon={faReceipt} size="2xl" />}
                            trailingContent={() => <FontAwesomeIcon icon={faChevronRight} />}
                            onClick={() => navigate(SAVING_TYPES_MANGER_PATH)}
                        >
                            <StyledParagraph>{typesData.length}</StyledParagraph>
                        </Tile>
                        <Tile
                            label="Saving Values"
                            leadingContent={() => <FontAwesomeIcon icon={faMoneyBills} size="2xl" />}
                            trailingContent={() => <FontAwesomeIcon icon={faChevronRight} />}
                            onClick={() => navigate(SAVING_VALUES_MANAGER_PATH)}
                            >
                            <StyledParagraph>{savingsData.length}</StyledParagraph>
                        </Tile>
                    </>
                }
            </TagsContainerUI>
            
            <FlexGrid flexGridColumnCount={1} {...managerSummaryGridOverrides}>
                <FlexGridItem>
                    <ListHeading 
                        heading="Savings This Month"
                        endEnhancer={() => `R$ ${savingsListData.reduce((acc, p) => acc + p.currentMonthValue, 0).toFixed(2)}`}
                        {...listHeadingOverrides}
                    />
                    {isSavingsListLoading ?
                        <Skeleton
                        rows={5}
                        height="20px"
                        animation
                    />
                    :
                        (savingsListData.map(saving => 
                                <ListItem
                                    endEnhancer={() => `R$ ${saving.currentMonthValue.toFixed(2)}`}
                                    {...listItemOverrides}
                                >
                                    <ListItemLabel>{saving.name}</ListItemLabel>
                                </ListItem>
                        ))
                    }
                </FlexGridItem>
            </FlexGrid>
            
        </ManagerSubPage>
    );
};

export default SavingsManager;