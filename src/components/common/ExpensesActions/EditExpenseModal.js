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
import { Input, SIZE as InputSize } from "baseui/input";
import { FormControl } from "baseui/form-control";


const EditExpenseModal = ({
    isOpen,
    onClose,
    onSaveClick,
    expenseValue,
    expenseType,
    isLoading
}) => {
    
    const [value, setValue] = React.useState(expenseValue);

    const [formErrors, setFormErrors] = React.useState({});

    const clearFields = () => {
        setValue(0.00)
    };

    const handleClose = () => {
        clearFields();
        onClose();
    };

    const validateAndSave = () => {
        onSaveClick({'value': value});
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
            <ModalHeader>Edit Expense Value: {expenseType}</ModalHeader>
            <ModalBody>
                <FormControl 
                    label="Value *"
                    error={"value" in formErrors ? formErrors["value"] : null}
                >
                    <Input
                        startEnhancer="R$"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="Base Value..."
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

export default EditExpenseModal;
