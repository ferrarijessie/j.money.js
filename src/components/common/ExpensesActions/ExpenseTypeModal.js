import * as React from "react";
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
import {
    Checkbox,
    LABEL_PLACEMENT
} from "baseui/checkbox";
import { Combobox } from "baseui/combobox";
import { Input, SIZE as InputSize } from "baseui/input";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { FormControl } from "baseui/form-control";
import { Datepicker } from "baseui/datepicker";

import { useExpenseTypesPost } from "../../../hooks/expenseTypes/useExpenseTypePost";
import { useExpenseTypePut } from "../../../hooks/expenseTypes/useExpenseTypePut";


const gridOverrides = {
    marginTop: '15px'
}

const checkboxItemOverrides = {
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingTop: '17px',
};

const ExpenseTypeModal = ({
    isOpen,
    onClose,
    reload,
    expenseType = null
}) => {
    
    const [isLoading, setIsLoading] = React.useState(false);
    const [typeName, setTypeName] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [recurrent, setRecurrent] = React.useState(false);
    const [baseValue, setBaseValue] = React.useState(0.00);
    const [endDate, setEndDate] = React.useState(new Date());

    const [formErrors, setFormErrors] = React.useState({});

    const { mutateAsync: addExpenseTypeRequest } = useExpenseTypesPost();
    const { mutateAsync: editExpenseTypeRequest } = useExpenseTypePut();

    const onSaveClick = async (typeName, category, recurrent, baseValue = 0) => {
        setIsLoading(true);

        const payload = {
            'name': typeName,
            'category': category,
            'recurrent': recurrent,
            'baseValue': baseValue,
            'endDate': endDate ? endDate.toISOString().split('T')[0] : null
        }

        if (expenseType !== null) {
            await editExpenseTypeRequest({
                id: expenseType["expenseTypeId"], 
                payload: payload
            });
        }
        else {
            await addExpenseTypeRequest(payload);
        }
        await reload();
        setIsLoading(false);
    };

    const clearFields = React.useCallback(() => {
        setFormErrors({});
        setTypeName(expenseType ? expenseType["name"] : "");
        setCategory(expenseType ? expenseType["category"].toUpperCase() : "");
        setRecurrent(expenseType ? expenseType["recurrent"] : false);
        setBaseValue(expenseType ? expenseType["baseValue"] : 0.00);
        setEndDate(expenseType && expenseType["endDate"] ? new Date(expenseType["endDate"]) : new Date());
    }, [expenseType]);

    React.useEffect(() => {
        if (expenseType !== null) {
            setTypeName(expenseType["name"]);
            setCategory(expenseType["category"].toUpperCase());
            setRecurrent(expenseType["recurrent"]);
            setBaseValue(expenseType["baseValue"]);
            setEndDate(expenseType["endDate"] ? new Date(expenseType["endDate"]) : new Date());
        }
        else {
            clearFields();
        }
    }, [expenseType, clearFields]);

    const options = React.useMemo(() => [
        {
        label: "HOUSE",
        id: "house"
        },
        {
        label: "CARD",
        id: "card"
        },
        {
        label: "PERSONAL",
        id: "personal"
        },
        {
        label: "COMPANY",
        id: "company"
        },
        {
        label: "SALON",
        id: "salon"
        },
        {
        label: "HEALTH",
        id: "health"
        },
    ], []);

    function mapOptionToString(option) {
        return option.label;
    };

    const filteredOptions = React.useMemo(() => {
        return options.filter((option) => {
          const optionAsString = mapOptionToString(option);
          return optionAsString
            .toLowerCase()
            .includes(category.toLowerCase());
        });
    }, [options, category]);

    const handleClose = () => {
        clearFields();
        onClose();
    };

    const validateAndSave = () => {
        const requiredMessage = "This field is required"
        let errors = {}

        if (typeName === ""){
            errors["name"] = requiredMessage;
        }
        if (category === "") {
            errors["category"] = requiredMessage;
        }
        if (options.filter(o => o.label === category).length === 0) {
            errors["category"] = "Invalid Category";
        }
        if (recurrent === true && baseValue <= 0) {
            errors["baseValue"] = "Please specify a base value"
        }
        
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        
        onSaveClick(typeName, category.toLowerCase(), recurrent, baseValue);
        handleClose();

    };

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
            <ModalHeader>{!!expenseType ? "Edit" : "Add"} Expense Type</ModalHeader>
            <ModalBody>
                <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                    <FlexGridItem>
                        <FormControl 
                            label="Expense Type Name *"
                            error={"name" in formErrors ? formErrors["name"] : null}
                        >
                            <Input
                            clearable
                            value={typeName}
                            onChange={e => setTypeName(e.target.value)}
                            placeholder="Enter Name..."
                            size={InputSize.compact}
                        />
                    </FormControl>
                </FlexGridItem>
                <FlexGridItem>
                    <FormControl 
                        label="Category *"
                        error={"category" in formErrors ? formErrors["category"] : null}
                    >
                            <Combobox
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                placeholder="Select Category..."
                                size={InputSize.compact}
                                options={filteredOptions}
                                mapOptionToString={mapOptionToString}
                            />
                        </FormControl>
                    </FlexGridItem>
                </FlexGrid>
                <FormControl 
                    label="Recurrent"
                    error={"recurrent" in formErrors ? formErrors["recurrent"] : null}
                >
                    <Checkbox
                        checked={recurrent}
                        onChange={(e) => setRecurrent(e.target.checked)}
                        label="Recurrent"
                        labelPlacement={LABEL_PLACEMENT.right}
                        overrides={checkboxItemOverrides}
                    />
                </FormControl>
                {recurrent && (
                    <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                        <FlexGridItem>
                            <FormControl 
                                label="End Date *"
                                error={"endDate" in formErrors ? formErrors["endDate"] : null}
                            >
                                <Datepicker
                                    onChange={({date}) => setEndDate(date)}
                                    placeholder="Select End Date..."
                                    size={InputSize.compact}
                                    formatString="dd/MM/yyyy"
                                    clearable
                                />
                            </FormControl>
                        </FlexGridItem>
                        <FlexGridItem>
                            <FormControl 
                                label="Base Value *"
                                error={"baseValue" in formErrors ? formErrors["baseValue"] : null}
                            >
                                <Input
                                    startEnhancer="R$"
                                    value={baseValue}
                                    onChange={e => setBaseValue(e.target.value)}
                                    placeholder="Enter Base Value..."
                                    size={InputSize.compact}
                                    type="number"
                                />
                            </FormControl>
                        </FlexGridItem>
                    </FlexGrid>
                )}
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

export default ExpenseTypeModal;
