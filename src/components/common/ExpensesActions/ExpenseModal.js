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
import { change, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';

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

let ExpenseModal = ({
    isOpen,
    onClose,
    reload,
    expenseTypes = [],
    expenseTypeInitial = null,
    expense = null,
    dispatch,
    handleSubmit
}) => {
    
    const [isLoading, setIsLoading] = React.useState(false);

    const { mutateAsync: addExpenseRequest } = useExpensePost();
    const { mutateAsync: editExpenseRequest } = useExpensePut();

    const onChangeOption = (value, input) => {
        input.onChange(value);
        if (value[0].baseValue) {
            dispatch(change('expenseForm', 'value', value[0].baseValue.toFixed(2)));
        }
    }; 

    const onSubmit = async (values) => {
        setIsLoading(true);

        const payload = {
            'year': values.year,
            'month': values.month[0].id,
            'typeId': values.expenseType[0].id,
            'value': values.value
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

    
    const options = expenseTypes?.map(eType => ({
        label: eType['name'],
        id: eType['expenseTypeId'],
        baseValue: eType['baseValue']
    }));

    const months = moment.months();
    const monthOptions = months.map((month, index) => ({
        label: month,
        id: index+1,
    }));

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
        dispatch(change('expenseForm', 'month', [monthOptions.find(m => m.id === parseInt(moment().format('MM')))]));
        dispatch(change('expenseForm', 'year', moment().format('YYYY')));

        if (!!expenseTypeInitial) {
            dispatch(change('expenseForm', 'expenseType', [options.find(e => e.id === expenseTypeInitial.expenseTypeId)]));
            dispatch(change('expenseForm', 'value', expenseTypeInitial.baseValue.toFixed(2)));
        }

        if (!!expense) {
            dispatch(change('expenseForm', 'expenseType', [options.find(e => e.id === expense['typeId'])]));
            dispatch(change('expenseForm', 'value', expense['value'].toFixed(2)));
            dispatch(change('expenseForm', 'month', [monthOptions.find(m => m.id === expense['month'])]));
            dispatch(change('expenseForm', 'year', expense['year']));
        }
    }, [dispatch, monthOptions, expenseTypeInitial, options, expense]);

    return (
        <>
         <ToasterContainer autoHideDuration={10000} overrides={toasterOverrides} />
         <Modal
            onClose={onClose}
            closeable
            isOpen={isOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
            >
            <ModalHeader>Edit Expense</ModalHeader>
         
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                    <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                        <FlexGridItem>
                            <Field
                                name="expenseType"
                                type="select"
                                options={options}
                                component={renderSelectField}
                                label="Expense Type"
                                placeholder="Select an expense type"
                                disabled={!!expense || !!expenseTypeInitial}
                            />
                        </FlexGridItem>
                        <FlexGridItem>
                            <Field
                                name="value"
                                type="number"
                                component={renderField}
                                label="Value"
                            />
                        </FlexGridItem>
                    </FlexGrid>

                    <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                        <FlexGridItem>
                            <Field
                                name="month"
                                type="number"
                                component={renderSelectField}
                                options={monthOptions}
                                label="Month"
                                placeholder="Select month"
                                disabled={false}
                            />
                        </FlexGridItem>
                        <FlexGridItem>
                            <Field
                                name="year"
                                type="number"
                                component={renderField}
                                label="Year"
                            />
                        </FlexGridItem>
                    </FlexGrid>
                </ModalBody>
                <ModalFooter>
                    <ModalButton 
                        kind={ButtonKind.tertiary} 
                        onClick={() => onClose()}
                        type={'button'}
                    >
                        Cancel
                    </ModalButton>
                    <ModalButton 
                        type={'submit'} 
                        isLoading={isLoading}
                    >
                        Save
                    </ModalButton>
                </ModalFooter>
            </form>
        </Modal>
        </>
    );
}

const validate = (values) => {
    const errors = {};
    
    if (!values.expenseType) {
        errors.expenseType = 'Required';
    }
    
    if (!values.value) {
        errors.value = 'Required';
    }

    if (!values.month) {
        errors.month = 'Required';
    }

    if (!values.year) {
        errors.year = 'Required';
    }
    
    return errors;
};

ExpenseModal = reduxForm({
    form: 'expenseForm',
    enableReinitialize: true,
    validate
})(ExpenseModal);

export default connect()(ExpenseModal);
