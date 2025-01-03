import React from "react";
import { Block } from "baseui/block";
import { Button, SIZE } from "baseui/button";
import { Skeleton } from "baseui/skeleton";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { useExpenseTypes } from "../../../../hooks/expenseTypes/useExpenseTypes";
import { useExpenseTypeDelete } from "../../../../hooks/expenseTypes/useExpenseTypeDelete";

import ConfirmActionModal from "../../../common/ConfirmActionModal";

import ManagerSubPage from "../../ManagerSubPage";
import ExpenseTypesTable from "./ExpenseTypesTable";
import ExpenseTypeModal from "../../../common/ExpenseTypeActions/ExpenseTypeModal";


const ExpenseTypeManager = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
    const [selectedExpenseType, setSelectedExpenseType] = React.useState(null);

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
            <ManagerSubPage 
                activeItem={"Expenses"} 
                activeSubItem={"Expense Types"}
                pageTitle={"Expense Types Manager"}
                actions={
                    <Button 
                        onClick={() => setIsModalOpen(true)}
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
                        <ExpenseTypesTable data={data} onClickEdit={onClickEdit} onClickDelete={onClickDelete} />
                    }
                </Block>
                
            </ManagerSubPage>

            <ExpenseTypeModal 
                isOpen={isModalOpen}
                onClose={onCloseModal}
                reload={reload}
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