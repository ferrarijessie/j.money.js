import React from "react";
import { useParams } from 'react-router';

import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Button, SIZE } from "baseui/button";
import { Skeleton } from "baseui/skeleton";
import { Block } from "baseui/block";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';

import { useExpenseType } from "../../../../hooks/expenseTypes/useExpenseType";
import { useExpenseDelete } from "../../../../hooks/expenses/useExpenseDelete";

import { EXPENSE_TYPES_MANAGER_PATH } from "../../../../AppPaths";

import ManagerSubPage from "../../ManagerSubPage";
import ExpenseTypeModal from "../../../common/ExpenseTypeActions/ExpenseTypeModal";
import ExpenseTable from "../ExpenseValues/ExpenseTable";
import EditExpenseModal from "../../../common/ExpensesActions/EditExpenseModal";
import AddExpenseModal from "../../../common/ExpensesActions/AddExpenseModal";
import ConfirmActionModal from "../../../common/ConfirmActionModal";

import { 
    buttonGridOverrides,
    detailsGridOverrides, 
} from "../../common/overrides";

import { DetailsLabelTextUI, DetailsTextUI } from "../../common/styled";


const ExpenseTypeDetails = () => {

    const { id } = useParams();

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
    const [selectedExpense, setSelectedExpense] = React.useState(null);
    const [isSaveLoading, setIsSaveLoading] = React.useState(false);

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
            <ManagerSubPage 
                activeItem={EXPENSE_TYPES_MANAGER_PATH} 
            >
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
                activeItem={EXPENSE_TYPES_MANAGER_PATH} 
                itemTitle={`#${expenseTypeData.expenseTypeId} ${expenseTypeData.name}`}
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

                <Block>
                    <FlexGrid flexGridColumnCount={3} {...detailsGridOverrides}>
                        <FlexGridItem>
                            <DetailsLabelTextUI>Category</DetailsLabelTextUI>
                            <DetailsTextUI>{expenseTypeData.category.toUpperCase()}</DetailsTextUI>
                        </FlexGridItem>
                        <FlexGridItem>
                            <DetailsLabelTextUI>Base Value</DetailsLabelTextUI>
                            <DetailsTextUI>{!!expenseTypeData.recurrent ? `R$ ${expenseTypeData.baseValue.toFixed(2)}` : '-'}</DetailsTextUI>
                        </FlexGridItem>
                        <FlexGridItem>
                            <DetailsLabelTextUI>Recurrent</DetailsLabelTextUI>
                            <DetailsTextUI>{expenseTypeData.recurrent ? 'Yes' : 'No'}</DetailsTextUI>
                        </FlexGridItem>
                    </FlexGrid>
                    <ExpenseTable 
                        data={expenseTypeData.expenseValues} 
                        onClickEdit={onClickEdit} 
                        onClickDelete={onClickDelete} 
                        reload={reload}
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
                reload={reload}
                expenseType={expenseTypeData}
            />
        </>
    )

};

export default ExpenseTypeDetails;
