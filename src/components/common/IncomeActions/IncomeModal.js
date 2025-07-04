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

import { useIncomePost } from "../../../hooks/incomes/useIncomePost";
import { useIncomePut } from "../../../hooks/incomes/useIncomePut";


const gridOverrides = {
    marginTop: '15px'
};

const IncomeModal = ({
    isOpen,
    onClose,
    reload,
    incomeTypes = [],
    incomeTypeInitial = null,
    income = null
}) => {
    
    const [isLoading, setIsLoading] = React.useState(false);
    const [incomeType, setIncomeType] = React.useState("");
    const [incomeTypeId, setIncomeTypeId] = React.useState(!!incomeTypeInitial ? incomeTypeInitial.incomeTypeId : 0);
    const [value, setValue] = React.useState(!!incomeTypeInitial ? incomeTypeInitial.baseValue.toFixed(2) : 0.00);
    const [month, setMonth] = React.useState(moment().format('MM'));
    const [year, setYear] = React.useState(moment().format('YYYY'));

    const [formErrors, setFormErrors] = React.useState({});

    const { mutateAsync: addIncomeRequest } = useIncomePost();
    const { mutateAsync: editIncomeResquest } = useIncomePut();

    const onSaveClick = async (typeId, value, month, year) => {
        setIsLoading(true);

        const payload = {
            'year': year,
            'month': month,
            'typeId': typeId,
            'value': value
        };

        if (!!income) {
            await editIncomeResquest({
                id: income["id"], 
                payload: payload})
        }
        else {
            await addIncomeRequest(payload);
        }

        await reload();
        setIsLoading(false);
        handleClose();
    };

    const clearFields = () => {
        setFormErrors({});
        setIncomeType("");
        setIncomeTypeId(!!incomeTypeInitial ? incomeTypeInitial.incomeTypeId : 0)
        setValue(!!incomeTypeInitial ? incomeTypeInitial.baseValue.toFixed(2) : 0.00);
        setMonth(moment().format('MM'));
        setYear(moment().format('YYYY'));
    };

    const options = incomeTypes?.map(iType => ({
        label: iType['name'],
        id: iType['incomeTypeId'],
        baseValue: iType['baseValue']
    }));

    const handleClose = () => {
        clearFields();
        onClose();
    };

    const validateAndSave = () => {
        const requiredMessage = "This field is required"
        let errors = {}

        if (!incomeTypeInitial && incomeType === ""){
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
        onSaveClick(incomeTypeId, value, month, year);
        handleClose();
    };

    const handleOptionchange = (option) => {
        setIncomeType(option);
        setIncomeTypeId(option['0']['id']);
        setValue(option[0]['baseValue'].toFixed(2));
    };

    React.useEffect(() => {
        if (income !== null) {
            setIncomeType(income.typeName);
            setIncomeTypeId(income.typeId)
            setValue(income.value.toFixed(2));
            setMonth(income.month);
            setYear(income.year);
        }
        else {
            clearFields();
        }
    }, [income]);

    return (
        <Modal
            onClose={handleClose}
            closeable
            isOpen={isOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>{income ? 'Edit' : 'Add'} Income</ModalHeader>
            <ModalBody>
                <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                    <FlexGridItem>
                    <FormControl 
                        label="Income Type *"
                        error={"type" in formErrors ? formErrors["type"] : null}
                    >
                        {!!incomeTypeInitial || !!income ? 
                            <Input 
                                value={!!incomeTypeInitial ? incomeTypeInitial.name : income.typeName}
                                disabled
                                size={InputSize.compact}
                            />
                        :
                            <Select
                                value={incomeType}
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
    );
}

export default IncomeModal;
