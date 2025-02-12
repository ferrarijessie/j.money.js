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

import { useSavingTypePost } from "../../../hooks/savingTypes/useSavingTypePost";
import { useSavingTypePut } from "../../../hooks/savingTypes/useSavingTypePut";


const gridOverrides = {
    marginTop: '15px'
}

const checkboxItemOverrides = {
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingTop: '17px',
};

const SavingTypeModal = ({
    isOpen,
    onClose,
    reload,
    savingType = null
}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [typeName, setTypeName] = React.useState("");
    const [active, setActive] = React.useState(false);
    const [baseValue, setBaseValue] = React.useState(0.00);

    const [formErrors, setFormErrors] = React.useState({});

    const { mutateAsync: addSavingTypeRequest } = useSavingTypePost();
    const { mutateAsync: editSavingTypeRequest } = useSavingTypePut();

    const onSaveClick = async (typeName, active, baseValue = 0) => {
        setIsLoading(true);

        const payload = {
            'name': typeName,
            'active': active,
            'baseValue': baseValue
        }

        if (savingType !== null) {
            await editSavingTypeRequest({
                id: savingType["id"], 
                payload: payload
            });
        }
        else {
            await addSavingTypeRequest(payload);
        }
        await reload();
        setIsLoading(false);
    };

    const clearFields = () => {
        setFormErrors({});
        setTypeName(!!savingType ? savingType["name"] : "");
        setActive(!!savingType ? savingType["active"] : false);
        setBaseValue(!!savingType ? savingType["baseValue"] : 0.00);
    };

    React.useEffect(() => {
        if (savingType !== null) {
            setTypeName(savingType["name"]);
            setActive(savingType["active"]);
            setBaseValue(savingType["baseValue"]);
        }
        else {
            clearFields();
        }
    }, [savingType]);

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
        
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        
        onSaveClick(typeName, active, baseValue);
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
            <ModalHeader>{!!savingType ? "Edit" : "Add"} Saving Type</ModalHeader>
            <ModalBody>
                <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                    <FlexGridItem>
                        <FormControl 
                            label="Saving Type Name *"
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
                            checked={active}
                            onChange={e => setActive(e.target.checked)}
                            labelPlacement={LABEL_PLACEMENT.right}
                            >
                            Active
                        </Checkbox>
                    </FlexGridItem>
                </FlexGrid>
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

export default SavingTypeModal;
