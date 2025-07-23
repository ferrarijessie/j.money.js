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
import { change, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { toaster } from 'baseui/toast';

import { useIncomePost } from "../../../hooks/incomes/useIncomePost";
import { useIncomePut } from "../../../hooks/incomes/useIncomePut";


const gridOverrides = {
    marginTop: '15px'
};

let IncomeModal = ({
    isOpen,
    onClose,
    reload,
    incomeTypes = [],
    incomeTypeInitial = null,
    income = null,
    dispatch,
    handleSubmit
}) => {
    
    const [isLoading, setIsLoading] = React.useState(false);

    const { mutateAsync: addIncomeRequest } = useIncomePost();
    const { mutateAsync: editIncomeResquest } = useIncomePut();

    const onSubmit = async (values) => {
        setIsLoading(true);

        const payload = {
            'year': values.year,
            'month': values.month[0].id,
            'typeId': values.incomeType[0].id,
            'value': values.value
        };

        try {
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
            toaster.positive("Income saved successfully");
            onClose();
        } catch (error) {
            toaster.negative(`${error}`);
            setIsLoading(false);
        }
    };

    const options = incomeTypes?.map(iType => ({
        label: iType['name'],
        id: iType['incomeTypeId'],
        baseValue: iType['baseValue']
    }));

    const months = moment.months();
    const monthOptions = months.map((month, index) => ({
        label: month,
        id: index+1,
    }));

    const onChangeOption = (value, input) => {
        input.onChange(value);
        if (value[0].baseValue) {
            dispatch(change('incomeForm', 'value', value[0].baseValue.toFixed(2)));
        }
    };

    const renderField = ({ input, label, type, meta: { touched, error } }) => (
            <FormControl label={label} error={touched && error && error}>
                <Input
                  {...input}
                  type={type}
                  size={InputSize.compact}
                />
            </FormControl>
        );
            
    const renderSelectField = ({ input, label, options, placeholder, disabled, meta: { touched, error } }) => (
        <FormControl label={label} error={touched && error && error}>
            <Select
                options={options}
                value={input.value}
                size={InputSize.compact}
                onChange={({ value }) => onChangeOption(value, input)}
                placeholder={!input.value ? placeholder : null}
                labelKey="label"
                valueKey="id"
                disabled={disabled}
            />
        </FormControl>
    );

    React.useEffect(() => {
        if (!!income) {
            dispatch(change('incomeForm', 'incomeType', [options.find(e => e.id === income['typeId'])]));
            dispatch(change('incomeForm', 'value', income['value'].toFixed(2)));
            dispatch(change('incomeForm', 'month', [monthOptions.find(m => m.id === income['month'])]));
            dispatch(change('incomeForm', 'year', income['year']));
        }
        if (!!incomeTypeInitial) {
            dispatch(change('incomeForm', 'incomeType', [options.find(e => e.id === incomeTypeInitial.incomeTypeId)]));
            dispatch(change('incomeForm', 'value', incomeTypeInitial.baseValue.toFixed(2)));
            dispatch(change('incomeForm', 'month', [monthOptions.find(m => m.id === parseInt(moment().format('MM')))]));
            dispatch(change('incomeForm', 'year', moment().format('YYYY')));
        }
        else {
            dispatch(change('incomeForm', 'month', [monthOptions.find(m => m.id === parseInt(moment().format('MM')))]));
            dispatch(change('incomeForm', 'year', moment().format('YYYY')));
        }
    }, [income, incomeTypeInitial, options, monthOptions, dispatch]);

    return (
        <Modal
            onClose={onClose}
            closeable
            isOpen={isOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>{income ? 'Edit' : 'Add'} Income</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
                <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                    <FlexGridItem>
                        <Field
                            name="incomeType"
                            type="select"
                            options={options}
                            component={renderSelectField}
                            label="Income Type"
                            placeholder="Select an income type"
                            disabled={!!income || !!incomeTypeInitial}
                        />
                    </FlexGridItem>
                    <FlexGridItem>
                        <Field
                            name="value"
                            type="number"
                            component={renderField}
                            label="Value *"
                            placeholder="Value..."
                        />
                    </FlexGridItem>
                </FlexGrid>

                <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                    <FlexGridItem>
                        <Field
                            name="month"
                            type="select"
                            options={monthOptions}
                            component={renderSelectField}
                            label="Month"
                            placeholder="Select a month"
                        />
                    </FlexGridItem>
                    <FlexGridItem>
                        <Field
                            name="year"
                            type="number"
                            component={renderField}
                            label="Year"
                            placeholder="Year..."
                        />
                    </FlexGridItem>
                </FlexGrid>
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary} onClick={onClose} type={'button'}>
                    Cancel
                </ModalButton>
                <ModalButton type={'submit'} isLoading={isLoading}>
                    Save
                </ModalButton>
            </ModalFooter>
            </form>
        </Modal>
    );
}

const validate = (values) => {
    const errors = {};

    if (!values.incomeType) {
        errors.incomeType = 'Income type is required';
    }
    
    if (!values.value) {
        errors.value = 'Value is required';
    }
    
    if (!values.month) {
        errors.month = 'Month is required';
    }
    
    if (!values.year) {
        errors.year = 'Year is required';
    }
    
    return errors;
};

IncomeModal = reduxForm({
    form: 'incomeForm',
    validate
})(IncomeModal);

export default connect()(IncomeModal);
