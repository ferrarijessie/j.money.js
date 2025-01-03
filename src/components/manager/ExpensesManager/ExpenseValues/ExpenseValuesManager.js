import React from "react";
import { Block } from "baseui/block";
import { Button, SIZE } from "baseui/button";
import { Skeleton } from "baseui/skeleton";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { useExpenses } from "../../../../hooks/expenses/useExpenses";
import { useExpensePost } from "../../../../hooks/expenses/useExpensePost";
import { useExpensePut } from "../../../../hooks/expenses/useExpensePut";
import { useExpenseDelete } from "../../../../hooks/expenses/useExpenseDelete";
import { useExpenseTypes } from "../../../../hooks/expenseTypes/useExpenseTypes";

import ConfirmActionModal from "../../../common/ConfirmActionModal";

import ManagerSubPage from "../../ManagerSubPage";
import ExpenseTable from "./ExpenseTable";
import AddExpenseModal from "../../../common/ExpensesActions/AddExpenseModal";
import EditExpenseModal from "../../../common/ExpensesActions/EditExpenseModal";


const ExpenseManager = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
    const [selectedExpense, setSelectedExpense] = React.useState(null);
    const [isSaveLoading, setIsSaveLoading] = React.useState(false);

    const { mutateAsync: addExpenseRequest } = useExpensePost();
    const { mutateAsync: editExpenseRequest } = useExpensePut();
    const { mutateAsync: deleteExpenseRequest } = useExpenseDelete();

    const {
        isLoading, 
        error, 
        data = [],
        refetch: reload
    } = useExpenses();

    const {
        data: expenseTypesData = []
    } = useExpenseTypes();

    const onCloseModal = () => {
        setIsAddModalOpen(false);
        setIsConfirmModalOpen(false);
        setSelectedExpense(null);
    };

    const handleActionClick = async (payload, id=null) => {
        setIsSaveLoading(true);
        const expenseId = !!selectedExpense ? selectedExpense['expenseId'] : id;

        await editExpenseRequest({
            id: expenseId, 
            payload: payload
        });
        await reload();
        setIsSaveLoading(false);
        setIsModalOpen(false);
        setSelectedExpense(null);
    };

    const handleAddClick = async (typeId, value, month, year) => {
        const payload = {
            'year': year,
            'month': month,
            'typeId': typeId,
            'value': value
        };
        await addExpenseRequest(payload);
        await reload();
    };

    const onClickEdit = (expense) => {
        setSelectedExpense(expense);
        setIsModalOpen(true);
    };

    const onClickDelete = (expense) => {
        setSelectedExpense(expense);
        setIsConfirmModalOpen(true);
    };

    const onConfirmDelete = async () => {
        await deleteExpenseRequest(selectedExpense["expenseId"]);
        await reload();
        onCloseModal();
    };

    return (
        <>
            <ManagerSubPage 
                activeItem={"Expenses"} 
                activeSubItem={"Expense Values"}
                pageTitle={"Expense Values Manager"}
                actions={
                    <Button 
                        onClick={() => setIsAddModalOpen(true)}
                        startEnhancer={<FontAwesomeIcon icon={faPlus} />}
                        size={SIZE.compact}
                    >
                        New
                    </Button>
                }
            >

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
                        <ExpenseTable data={data} onClickEdit={onClickEdit} onClickDelete={onClickDelete} />
                    }
                </Block>

            </ManagerSubPage>

            {selectedExpense &&
                <>
                    <EditExpenseModal 
                        isOpen={isModalOpen} 
                        onClose={onCloseModal} 
                        onSaveClick={handleActionClick}
                        expenseValue={selectedExpense['value']}
                        expenseType={selectedExpense['type']} 
                        isLoading={isSaveLoading}
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
                onSaveClick={handleAddClick}
                expenseTypes={expenseTypesData}
                isLoading={isSaveLoading}
            />
        </>
    );
};

export default ExpenseManager;