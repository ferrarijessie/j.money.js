import React from "react";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { Heading, HeadingLevel } from 'baseui/heading';
import { Skeleton } from "baseui/skeleton";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { useExpenseTypes } from "../../../../hooks/expenseTypes/useExpenseTypes";
import { useExpenseTypesPost } from "../../../../hooks/expenseTypes/useExpenseTypePost";
import { useExpenseTypePut } from "../../../../hooks/expenseTypes/useExpenseTypePut";
import { useExpenseTypeDelete } from "../../../../hooks/expenseTypes/useExpenseTypeDelete";

import ConfirmActionModal from "../../../common/ConfirmActionModal";

import ManagerSubPage from "../../ManagerSubPage";
import ExpenseTypesTable from "./ExpenseTypesTable";
import ExpenseTypeModal from "./ExpenseTypeModal";


const buttonGridOverrides = {
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'flex-end'
};

const ExpenseTypeManager = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
    const [selectedExpenseType, setSelectedExpenseType] = React.useState(null);

    const { mutateAsync: addExpenseTypeRequest } = useExpenseTypesPost();
    const { mutateAsync: editExpenseTypeRequest } = useExpenseTypePut();
    const { mutateAsync: deleteExpenseTypeRequest } = useExpenseTypeDelete();

    const {
        isLoading, 
        error, 
        data = [],
        refetch: reload
    } = useExpenseTypes();

    const onCloseModal = () => {
        setIsModalOpen(false);
        setIsConfirmModalOpen(false);
        setSelectedExpenseType(null);
    };

    const handleSaveClick = async (name, category, recurrent, baseValue = 0) => {
        const payload = {
            'name': name,
            'category': category,
            'recurrent': recurrent,
            'baseValue': baseValue
        }

        if (selectedExpenseType !== null) {
            await editExpenseTypeRequest({
                id: selectedExpenseType["expenseTypeId"], 
                payload: payload
            });
        }
        else {
            await addExpenseTypeRequest(payload);
        }
        setSelectedExpenseType(null);
        await reload();
    };

    const onClickEdit = (expenseType) => {
        setSelectedExpenseType(expenseType);
        setIsModalOpen(true);
    };

    const onClickDelete = (expenseType) => {
        setSelectedExpenseType(expenseType);
        setIsConfirmModalOpen(true);
    };

    const onConfirmDelete = async () => {
        await deleteExpenseTypeRequest(selectedExpenseType["expenseTypeId"]);
        await reload();
        onCloseModal();
    };

    return (
        <>
            <ManagerSubPage activeItem={"Expenses"} activeSubItem={"Expense Types"}>
                <FlexGrid flexGridColumnCount={2}>
                    <FlexGridItem>
                        <HeadingLevel>
                            <HeadingLevel>
                                <HeadingLevel>
                                    <Heading>Expense Types Manager</Heading>
                                </HeadingLevel>
                            </HeadingLevel>
                        </HeadingLevel>
                    </FlexGridItem>
                    <FlexGridItem {...buttonGridOverrides}>
                        <Button 
                            onClick={() => setIsModalOpen(true)}
                            startEnhancer={<FontAwesomeIcon icon={faPlus} />}
                        >
                                New
                        </Button>
                    </FlexGridItem>
                </FlexGrid>
                

                <Block>
                    {isLoading &&
                        <Skeleton
                            rows={0}
                            height="100px"
                            width="100%"
                            animation
                        />
                    }
                    {data.length > 0 &&
                        <ExpenseTypesTable data={data} onClickEdit={onClickEdit} onClickDelete={onClickDelete} />
                    }
                </Block>
            </ManagerSubPage>

            <ExpenseTypeModal 
                isOpen={isModalOpen}
                onClose={onCloseModal}
                onSaveClick={handleSaveClick}
                expenseType={selectedExpenseType}
            />

            {selectedExpenseType && 
                <ConfirmActionModal 
                    isOpen={isConfirmModalOpen}
                    onClose={onCloseModal}
                    onConfirmClick={onConfirmDelete}
                    title="Delete Expense Type"
                    content={`Are you sure you want to delete Expense Type #${selectedExpenseType["expenseTypeId"]} - ${selectedExpenseType["name"]}?`}
                />
            }
        </>
    );
};

export default ExpenseTypeManager;