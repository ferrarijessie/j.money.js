import React from "react";
import { useParams } from 'react-router';

import { Heading, HeadingLevel } from 'baseui/heading';
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Button, SIZE } from "baseui/button";
import { Tag, HIERARCHY } from "baseui/tag";
import { Skeleton } from "baseui/skeleton";
import { Block } from "baseui/block";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';

import { useExpenseType } from "../../../../hooks/expenseTypes/useExpenseType";
import { useExpenseTypePut } from "../../../../hooks/expenseTypes/useExpenseTypePut";
import { useExpenseDelete } from "../../../../hooks/expenses/useExpenseDelete";

import ManagerSubPage from "../../ManagerSubPage";
import ExpenseTypeModal from "./ExpenseTypeModal";
import ExpenseTable from "../ExpenseValues/ExpenseTable";
import EditExpenseModal from "../../../common/ExpensesActions/EditExpenseModal";
import AddExpenseModal from "../../../common/ExpensesActions/AddExpenseModal";
import ConfirmActionModal from "../../../common/ConfirmActionModal";

import { buttonGridOverrides } from "../../common/overrides";


const ExpenseTypeDetails = () => {

    const { id } = useParams();

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
    const [selectedExpense, setSelectedExpense] = React.useState(null);
    const [isSaveLoading, setIsSaveLoading] = React.useState(false);

    const { mutateAsync: editExpenseTypeRequest } = useExpenseTypePut();
    const { mutateAsync: deleteExpenseRequest } = useExpenseDelete();

    const {
        data: expenseTypeData = {},
        isLoading,
        refetch: reload
    } = useExpenseType(id);

    const onCloseModal = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setIsConfirmModalOpen(false);
        setSelectedExpense(null);
    };

    const handleSaveClick = async (name, category, recurrent, baseValue = 0) => {
        const payload = {
            'name': name,
            'category': category,
            'recurrent': recurrent,
            'baseValue': baseValue
        }
        
        await editExpenseTypeRequest({
                id: expenseTypeData["expenseTypeId"], 
                payload: payload
            });
        await reload();
    };

    const onClickEdit = (expense) => {
        setSelectedExpense(expense);
        setIsEditModalOpen(true);
    };

    const onClickDelete = (expense) => {
        setSelectedExpense(expense);
        setIsConfirmModalOpen(true);
    };

    const onConfirmDelete = async () => {
        setIsSaveLoading(true);

        await deleteExpenseRequest(selectedExpense["expenseId"]);
        await reload();
        onCloseModal();

        setIsSaveLoading(false);
    };

    if (isLoading) {
        return (
            <ManagerSubPage activeItem={"Expenses"} activeSubItem={"Expense Types"}>
                <FlexGrid flexGridColumnCount={2}>
                    <FlexGridItem>
                        <Skeleton
                            rows={0}
                            height="100px"
                            width="100%"
                            animation
                        />
                    </FlexGridItem>
                    <FlexGridItem {...buttonGridOverrides}>
                        <Skeleton
                            rows={0}
                            height="100px"
                            width="100%"
                            animation
                        />
                    </FlexGridItem>
                </FlexGrid>
            </ManagerSubPage>
        );
    };

    return (
        <>
            <ManagerSubPage 
                activeItem={"Expenses"} 
                activeSubItem={"Expense Types"}
                pageTitle={`#${expenseTypeData.expenseTypeId} ${expenseTypeData.name}`}
                actions={
                    <>
                        <Button 
                            onClick={() => setIsModalOpen(true)}
                            startEnhancer={<FontAwesomeIcon icon={faPencil} />}
                            size={SIZE.compact}
                        >
                                Edit
                        </Button>
                        <Button 
                            onClick={() => setIsAddModalOpen(true)}
                            startEnhancer={<FontAwesomeIcon icon={faPlus} />}
                            size={SIZE.compact}
                        >
                                Add Value
                        </Button>
                    </>
                }
            >
                <FlexGrid>
                    <FlexGridItem>
                        <Tag 
                            closeable={false}
                            hierarchy={HIERARCHY.primary}
                        >
                            {expenseTypeData.category.toLowerCase()}
                        </Tag>
                        <Tag 
                            closeable={false}
                            hierarchy={HIERARCHY.primary}
                        >
                            {expenseTypeData.recurrent ? 'recurrent' : 'non-recurrent'}
                        </Tag>
                        {expenseTypeData.recurrent &&
                            <Tag 
                            closeable={false}
                            hierarchy={HIERARCHY.primary}
                        >
                            R$ {expenseTypeData.baseValue.toFixed(2)}
                        </Tag>
                        }
                    </FlexGridItem>
                </FlexGrid>

                <Block>
                    <ExpenseTable 
                        data={expenseTypeData.expenseValues} 
                        onClickEdit={onClickEdit} 
                        onClickDelete={onClickDelete} 
                    />
                </Block>
            </ManagerSubPage>

            {!!selectedExpense &&
                <>
                    <EditExpenseModal 
                        isOpen={isEditModalOpen} 
                        onClose={onCloseModal} 
                        reload={reload}
                        expenseValue={selectedExpense['value']}
                        expenseType={selectedExpense['type']} 
                        selectedExpense={selectedExpense}
                    />

                    <ConfirmActionModal 
                        isOpen={isConfirmModalOpen}
                        onClose={onCloseModal}
                        onConfirmClick={onConfirmDelete}
                        title="Delete Expense"
                        content={`Are you sure you want to delete Expense #${selectedExpense["expenseId"]} - ${selectedExpense["type"]}?`}
                        isLoading={isSaveLoading}
                    />
                </>
            }

            <AddExpenseModal 
                isOpen={isAddModalOpen}
                onClose={onCloseModal}
                reload={reload}
                expenseTypes={null}
                expenseTypeInitial={expenseTypeData} 
            />

            <ExpenseTypeModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSaveClick={handleSaveClick}
                expenseType={expenseTypeData}
            />
        </>
    )

};

export default ExpenseTypeDetails;
