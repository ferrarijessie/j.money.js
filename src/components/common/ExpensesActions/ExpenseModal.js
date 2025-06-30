import * as React from "react";
import moment from "moment";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE
} from "baseui/modal";
import { KIND as ButtonKind } from "baseui/button";
import { Select } from "baseui/select";
import { Input, SIZE as InputSize } from "baseui/input";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { FormControl } from "baseui/form-control";
import { toaster, ToasterContainer } from "baseui/toast";

import { useExpensePost } from "../../../hooks/expenses/useExpensePost"; 
import { useExpensePut } from "../../../hooks/expenses/useExpensePut";


const gridOverrides = {
    marginTop: '15px'
};

const toasterOverrides = {
    ToastBody: {
        style: {
            width: '500px'
        }
    }
};

const ExpenseModal = ({
    isOpen,
    onClose,
    reload,
    expenseTypes = [],
    expenseTypeInitial = null,
    expense = null
}) => {
    
    const [isLoading, setIsLoading] = React.useState(false);
    const [expenseType, setExpenseType] = React.useState("");
    const [expenseTypeId, setExpenseTypeId] = React.useState(!!expenseTypeInitial ? expenseTypeInitial.expenseTypeId : 0);
    const [value, setValue] = React.useState(!!expenseTypeInitial ? expenseTypeInitial.baseValue.toFixed(2) : 0.00);
    const [month, setMonth] = React.useState(moment().format('MM'));
    const [year, setYear] = React.useState(moment().format('YYYY'));

    const [formErrors, setFormErrors] = React.useState({});

    const { mutateAsync: addExpenseRequest } = useExpensePost();
    const { mutateAsync: editExpenseRequest } = useExpensePut();

    const onSaveClick = async (typeId, value, month, year) => {
        setIsLoading(true);

        const payload = {
            'year': year,
            'month': month,
            'typeId': typeId,
            'value': value
        };

        try {
            if (!!expense) {
                await editExpenseRequest({
                    id: expense['id'], 
                    payload: payload
                });
            } else {
                await addExpenseRequest(payload);
            }
            await reload();
            setIsLoading(false);
            onClose();
        } catch (error) {
            toaster.negative(`${error}`);
            setIsLoading(false);
        }   
    };

    const clearFields = () => {
        setFormErrors({});
        setExpenseType("");
        setValue(!!expenseTypeInitial ? expenseTypeInitial.baseValue.toFixed(2) : 0.00);
        setMonth(moment().format('MM'));
        setYear(moment().format('YYYY'));
    };

    const options = expenseTypes?.map(eType => ({
        label: eType['name'],
        id: eType['expenseTypeId'],
        baseValue: eType['baseValue']
    }));

    const handleClose = () => {
        clearFields();
        onClose();
    };

    const validateAndSave = () => {
        const requiredMessage = "This field is required"
        let errors = {}

        if (!expenseTypeInitial && expenseType === ""){
            errors["type"] = requiredMessage;
        }
        if (value <= 0) {
            errors["value"] = "Please specify a base value"
        }
        if (month <= 0){
            errors["month"] = requiredMessage;
        }
        if (year <= 0){
            errors["year"] = requiredMessage;
        }
        
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        onSaveClick(expenseTypeId, value, month, year);
        handleClose();
    };

    const handleOptionchange = (option) => {
        setExpenseType(option);
        setExpenseTypeId(option['0']['id']);
        setValue(option[0]['baseValue'].toFixed(2));
    };

    React.useEffect(() => {
        if (expense !== null) {
            setExpenseType(expense.typeName);
            setExpenseTypeId(expense.typeId)
            setValue(expense.value.toFixed(2));
            setMonth(expense.month);
            setYear(expense.year);
        }
        else {
            clearFields();
        }
    }, [expense]);

    return (
        <>
         <ToasterContainer autoHideDuration={10000} overrides={toasterOverrides} />

         <Modal
            onClose={handleClose}
            closeable
            isOpen={isOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>Add Expense</ModalHeader>
            <ModalBody>
                <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                    <FlexGridItem>
                    <FormControl 
                        label="Expense Type *"
                        error={"type" in formErrors ? formErrors["type"] : null}
                    >
                        {!!expenseTypeInitial || expense ?
                            <Input 
                                value={!!expenseTypeInitial ? expenseTypeInitial.name : expense.typeName}
                                disabled
                                size={InputSize.compact}
                            /> 
                        :
                            <Select
                                value={expenseType}
                                onChange={({ value }) => handleOptionchange(value)}
                                options={options}
                                size={InputSize.compact}
                                labelKey="label"
                                valueKey="id"
                            />
                        }
                    </FormControl>
                    </FlexGridItem>
                    <FlexGridItem>
                        <FormControl 
                            label="Value *"
                            error={"value" in formErrors ? formErrors["value"] : null}
                        >
                            <Input
                                startEnhancer="R$"
                                value={value}
                                onChange={e => setValue(e.target.value)}
                                placeholder="Value..."
                                size={InputSize.compact}
                                type="number"
                            />
                        </FormControl>
                    </FlexGridItem>
                </FlexGrid>

                <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                    <FlexGridItem>
                        <FormControl 
                            label="Month"
                            error={"month" in formErrors ? formErrors["month"] : null}
                        >
                            <Input 
                                value={month}
                                onChange={e => setMonth(e.target.value)}
                                placeholder="Specify Month..."
                                size={InputSize.compact}
                                type="number"
                            />
                        </FormControl>
                    </FlexGridItem>
                    <FlexGridItem>
                        <FormControl 
                            label="Year"
                            error={"year" in formErrors ? formErrors["year"] : null}
                        >
                            <Input 
                                value={year}
                                onChange={e => setYear(e.target.value)}
                                placeholder="Specify Year..."
                                size={InputSize.compact}
                                type="number"
                            />
                        </FormControl>
                    </FlexGridItem>
                </FlexGrid>
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary} onClick={handleClose}>
                    Cancel
                </ModalButton>
                <ModalButton type={'submit'} onClick={() => validateAndSave()} isLoading={isLoading}>
                    Save
                </ModalButton>
            </ModalFooter>
        </Modal>
        </>
    );
}

export default ExpenseModal;
