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

import { useSavingPost } from "../../../hooks/savings/useSavingPost";
import { useSavingPut } from "../../../hooks/savings/useSavingPut";


const gridOverrides = {
    marginTop: '15px'
};

const SavingValueModal = ({
    isOpen,
    onClose,
    reload,
    savingTypes = [],
    savingTypeInitial = null,
    saving = null
}) => {
    
    const [isLoading, setIsLoading] = React.useState(false);
    const [savingType, setSavingType] = React.useState("");
    const [savingTypeId, setSavingTypeId] = React.useState(0);
    const [value, setValue] = React.useState(0.00);
    const [month, setMonth] = React.useState(moment().format('MM'));
    const [year, setYear] = React.useState(moment().format('YYYY'));

    const [formErrors, setFormErrors] = React.useState({});

    const { mutateAsync: addSavingRequest } = useSavingPost();
    const { mutateAsync: editSavingResquest } = useSavingPut();

    const onSaveClick = async (typeId, value, month, year) => {
        setIsLoading(true);

        const payload = {
            'year': year,
            'month': month,
            'typeId': typeId,
            'value': value
        };

        if (!!saving) {
            await editSavingResquest({
                id: saving["id"], 
                payload: payload})
        }
        else {
            await addSavingRequest(payload);
        }

        await reload();
        setIsLoading(false);
        handleClose();
    };

    const clearFields = () => {
        setSavingType("");
        setSavingTypeId(!!savingTypeInitial ? savingTypeInitial.id : 0)
        setValue(!!savingTypeInitial ? savingTypeInitial.baseValue.toFixed(2) : 0.00);
        setMonth(moment().format('MM'));
        setYear(moment().format('YYYY'));
    };

    const options = savingTypes?.map(sType => ({
        label: sType['name'],
        id: sType['id'],
        baseValue: sType['baseValue']
    }));

    const handleClose = () => {
        clearFields();
        onClose();
    };

    const validateAndSave = () => {
        const requiredMessage = "This field is required"
        let errors = {}

        if (!savingTypeInitial && savingType === ""){
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
        onSaveClick(savingTypeId, value, month, year);
        handleClose();
    };

    const handleOptionchange = (option) => {
        setSavingType(option);
        setSavingTypeId(option['0']['id']);
        setValue(option[0]['baseValue'].toFixed(2));
    };

    React.useEffect(() => {
        if (saving !== null) {
            setSavingType(saving.typeName);
            setSavingTypeId(saving.typeId)
            setValue(saving.value.toFixed(2));
            setMonth(saving.month);
            setYear(saving.year);
        }
        else {
            clearFields();
        }
    }, [saving]);

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
            <ModalHeader>{saving ? 'Edit' : 'Add'} Saving</ModalHeader>
            <ModalBody>
                <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                    <FlexGridItem>
                    <FormControl 
                        label="Saving Type *"
                        error={"type" in formErrors ? formErrors["type"] : null}
                    >
                        {!!savingTypeInitial || !!saving ? 
                            <Input 
                                value={!!savingTypeInitial ? savingTypeInitial.name : saving.typeName}
                                disabled
                                size={InputSize.compact}
                            />
                        :
                            <Select
                                value={savingType}
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

export default SavingValueModal;
