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

import { useSignup } from '../../hooks/auth/useSignup';


const SignupModal = ({
    isOpen,
    onClose,
    setToken,
}) => {
    
    const [username, setUserName] = React.useState();
    const [password, setPassword] = React.useState();

    const [formErrors, setFormErrors] = React.useState({});

    const { mutateAsync: signupRequest, isLoading } = useSignup();

    const onSaveClick = async () => {
        try {
            const resp = await signupRequest({
                "username": username,
                "password": password
            });
            setToken(resp);
            window.location.reload();
        } catch(error) {
            setFormErrors({"username": "Username already taken"})
        }
    };

    const clearFields = () => {
        setFormErrors({});
        setUserName("");
        setPassword("");
    };

    const validateAndSave = () => {
        const requiredMessage = "This field is required"
        let errors = {}

        if (username === ""){
            errors["username"] = requiredMessage;
        }
        if (password === "") {
            errors["password"] = requiredMessage;
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        onSaveClick(username, password);
    };

    const handleClose = () => {
        clearFields();
        onClose();
    };

    return (
        <Modal
        onClose={() => handleClose()}
        closeable
        isOpen={isOpen}
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        >
            <ModalHeader>Signup</ModalHeader>
            <ModalBody>
                <FormControl 
                    label="Username *"
                    error={"username" in formErrors ? formErrors["username"] : null}
                >
                    <Input
                        clearable
                        value={username}
                        onChange={e => setUserName(e.target.value)}
                        placeholder="Enter Name..."
                        size={InputSize.compact}
                    />
                </FormControl>
                
                <FormControl 
                    label="Password *"
                    error={"password" in formErrors ? formErrors["password"] : null}
                >
                    <Input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        size={InputSize.compact}
                        type="password"
                    />
                </FormControl>
                
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary} onClick={() => handleClose()}>
                    Cancel
                </ModalButton>
                <ModalButton type={'submit'} onClick={() => validateAndSave()} isLoading={isLoading}>
                    Save
                </ModalButton>
            </ModalFooter>
        </Modal>
    );
}

export default SignupModal;
