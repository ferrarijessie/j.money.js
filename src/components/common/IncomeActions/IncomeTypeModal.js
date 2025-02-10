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
import { Input, SIZE as InputSize } from "baseui/input";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { FormControl } from "baseui/form-control";

import { useIncomeTypePost } from "../../../hooks/incomeTypes/useIncomeTypePost";
import { useIncomeTypePut } from "../../../hooks/incomeTypes/useIncomeTypePut";


const gridOverrides = {
    marginTop: '15px'
}

const checkboxItemOverrides = {
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingTop: '17px',
};

const IncomeTypeModal = ({
    isOpen,
    onClose,
    reload,
    incomeType = null
}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [typeName, setTypeName] = React.useState(!!incomeType ? incomeType["name"] : "");
    const [recurrent, setRecurrent] = React.useState(!!incomeType ? incomeType["recurrent"] : false);
    const [baseValue, setBaseValue] = React.useState(!!incomeType ? incomeType["baseValue"] : 0.00);

    const [formErrors, setFormErrors] = React.useState({});

    const { mutateAsync: addIncomeTypeRequest } = useIncomeTypePost();
    const { mutateAsync: editIncomeTypeRequest } = useIncomeTypePut();

    const onSaveClick = async (typeName, recurrent, baseValue = 0) => {
        setIsLoading(true);

        const payload = {
            'name': typeName,
            'recurrent': recurrent,
            'baseValue': baseValue
        }

        if (incomeType !== null) {
            await editIncomeTypeRequest({
                id: incomeType["incomeTypeId"], 
                payload: payload
            });
        }
        else {
            await addIncomeTypeRequest(payload);
        }
        await reload();
        setIsLoading(false);
    };

    const clearFields = () => {
        setFormErrors({});
        setTypeName(!!incomeType ? incomeType["name"] : "");
        setRecurrent(!!incomeType ? incomeType["recurrent"] : false);
        setBaseValue(!!incomeType ? incomeType["baseValue"] : 0.00);
    };

    React.useEffect(() => {
        if (incomeType !== null) {
            setTypeName(incomeType["name"]);
            setRecurrent(incomeType["recurrent"]);
            setBaseValue(incomeType["baseValue"]);
        }
        else {
            clearFields();
        }
    }, [incomeType]);

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
        if (recurrent === true && baseValue <= 0) {
            errors["baseValue"] = "Please specify a base value"
        }
        
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        
        onSaveClick(typeName, recurrent, baseValue);
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
            <ModalHeader>{!!incomeType ? "Edit" : "Add"} Income Type</ModalHeader>
            <ModalBody>
                <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                    <FlexGridItem>
                        <FormControl 
                            label="Income Type Name *"
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
                <ModalButton type={'submit'} onClick={() => validateAndSave()} isLoading={isLoading}>
                    Save
                </ModalButton>
            </ModalFooter>
        </Modal>
    );
}

export default IncomeTypeModal;
