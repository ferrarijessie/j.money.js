import React from "react";
import { Block } from "baseui/block";
import { Button, SIZE } from "baseui/button";
import { Skeleton } from "baseui/skeleton";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { EXPENSE_VALUES_MANAGER_PATH } from "../../../../AppPaths";

import { useExpenses } from "../../../../hooks/expenses/useExpenses";
import { useExpenseDelete } from "../../../../hooks/expenses/useExpenseDelete";
import { useExpenseTypes } from "../../../../hooks/expenseTypes/useExpenseTypes";

import AddExpenseModal from "../../../common/ExpensesActions/AddExpenseModal";
import EditExpenseModal from "../../../common/ExpensesActions/EditExpenseModal";
import ConfirmActionModal from "../../../common/ConfirmActionModal";

import ManagerSubPage from "../../ManagerSubPage";
import BlankState from "../../common/BlankState";

import ExpenseTable from "./ExpenseTable";


const ExpenseManager = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
    const [selectedExpense, setSelectedExpense] = React.useState(null);
    const [isSaveLoading, setIsSaveLoading] = React.useState(false);

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
        setIsModalOpen(false);
        setIsAddModalOpen(false);
        setIsConfirmModalOpen(false);
        setSelectedExpense(null);
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
        setIsSaveLoading(true);

        await deleteExpenseRequest(selectedExpense["expenseId"]);
        await reload();
        onCloseModal();

        setIsSaveLoading(false);
    };

    return (
        <>
            <ManagerSubPage 
                activeItem={EXPENSE_VALUES_MANAGER_PATH} 
                itemTitle={"Expense Values"}
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
                    {data.length > 0 ?
                        <ExpenseTable 
                            expensesData={data} 
                            onClickEdit={onClickEdit} 
                            onClickDelete={onClickDelete} 
                            reload={reload}
                        />
                    :
                        <BlankState />
                    }
                </Block>

            </ManagerSubPage>

            {selectedExpense &&
                <>
                    <EditExpenseModal 
                        isOpen={isModalOpen} 
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
                        content={`Are you sure you want to delete Expense ${selectedExpense["expenseTypeName"]} - ${selectedExpense["month"]}/${selectedExpense["year"]}?`}
                        isLoading={isSaveLoading}
                    />
                </>
            }

            <AddExpenseModal 
                isOpen={isAddModalOpen}
                onClose={onCloseModal}
                reload={reload}
                expenseTypes={expenseTypesData}
                isLoading={isSaveLoading}
            />
        </>
    );
};

export default ExpenseManager;