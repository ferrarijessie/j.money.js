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
    onSaveClick,
    expenseType = null
}) => {
    
    const [typeName, setTypeName] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [recurrent, setRecurrent] = React.useState(false);
    const [baseValue, setBaseValue] = React.useState(0.00);

    const [formErrors, setFormErrors] = React.useState({});

    const clearFields = () => {
        setFormErrors({});
        setTypeName("");
        setCategory("");
        setRecurrent(false);
        setBaseValue(0.00);
    };

    React.useEffect(() => {
        if (expenseType !== null) {
            setTypeName(expenseType["name"]);
            setCategory(expenseType["category"].toUpperCase());
            setRecurrent(expenseType["recurrent"]);
            setBaseValue(expenseType["baseValue"]);
        }
        else {
            clearFields();
        }
    }, [expenseType]);

    const options = [
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
    ];

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
                <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                    <FlexGridItem>
                    <FormControl 
                        label="Category *"
                        error={"category" in formErrors ? formErrors["category"] : null}
                    >
                        <Combobox
                            value={category}
                            onChange={nextValue => setCategory(nextValue)}
                            required
                            options={filteredOptions}
                            size={InputSize.compact}
                            overrides={{
                                Input: {
                                    props: {
                                        placeholder: 'Select...',
                                    },
                                },
                            }}
                            mapOptionToString={option => option.label}
                        />
                    </FormControl>
                    </FlexGridItem>
                    <FlexGridItem {...checkboxItemOverrides}>
                        <Checkbox
                            checked={recurrent}
                            onChange={e => setRecurrent(e.target.checked)}
                            labelPlacement={LABEL_PLACEMENT.right}
                            >
                            Recurrent
                        </Checkbox>
                    </FlexGridItem>
                </FlexGrid>
                {recurrent && 
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
                }
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary} onClick={handleClose}>
                    Cancel
                </ModalButton>
                <ModalButton type={'submit'} onClick={() => validateAndSave()}>
                    Save
                </ModalButton>
            </ModalFooter>
        </Modal>
    );
}

export default ExpenseTypeModal;
