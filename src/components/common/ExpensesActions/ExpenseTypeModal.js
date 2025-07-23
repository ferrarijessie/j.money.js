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
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { change, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { toaster, ToasterContainer } from "baseui/toast";

import { renderField, renderSelectField, renderCheckboxField, renderDateField } from "../formComponents";

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

const toasterOverrides = {
    ToastBody: {
        style: {
            width: '500px'
        }
    }
};

let ExpenseTypeModal = ({
    isOpen,
    onClose,
    reload,
    expenseType = null,
    dispatch,
    handleSubmit
}) => {
    
    const [isLoading, setIsLoading] = React.useState(false);
    const [recurrent, setRecurrent] = React.useState(false);

    const { mutateAsync: addExpenseTypeRequest } = useExpenseTypesPost();
    const { mutateAsync: editExpenseTypeRequest } = useExpenseTypePut();

    const onSubmit = async (values) => {
        setIsLoading(true);

        const payload = {
            'name': values.name,
            'category': values.category[0].id,
            'recurrent': values.recurrent,
            'baseValue': values.baseValue,
            'endDate': values.endDate ? values.endDate.toISOString().split('T')[0] : null
        }

        try {
            if (expenseType !== null) {
                await editExpenseTypeRequest({
                    id: expenseType["expenseTypeId"], 
                    payload: payload
                });
            }
            else {
                await addExpenseTypeRequest(payload);
            }
            toaster.positive("Expense type saved successfully");
            await reload();
            setIsLoading(false);
            onClose();
        } catch (error) {
            toaster.negative(`${error}`);
            setIsLoading(false);
        }   
    };

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

    const handleOptionChange = (value, input) => {
        input.onChange(value);
    };

    const handleCheckboxChange = (value, input) => {
        input.onChange(value);
        setRecurrent(!recurrent);
    };

    React.useEffect(() => {
        if (expenseType !== null) {
            dispatch(change('expenseTypeForm', 'name', expenseType["name"]));
            dispatch(change('expenseTypeForm', 'category', [options.find(o => o.id === expenseType["category"]) || options[0]]));
            dispatch(change('expenseTypeForm', 'recurrent', expenseType["recurrent"]));
            dispatch(change('expenseTypeForm', 'baseValue', expenseType["baseValue"]));
            dispatch(change('expenseTypeForm', 'endDate', expenseType["endDate"] ? new Date(expenseType["endDate"]) : new Date()));
            setRecurrent(expenseType["recurrent"]);
        }
        else {
            dispatch(change('expenseTypeForm', 'name', ''));
            dispatch(change('expenseTypeForm', 'category', []));
            dispatch(change('expenseTypeForm', 'recurrent', false));
            dispatch(change('expenseTypeForm', 'baseValue', 0.00));
            dispatch(change('expenseTypeForm', 'endDate', new Date()));
        }
    }, [expenseType, dispatch, options]);

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
            <ModalHeader>{!!expenseType ? "Edit" : "Add"} Expense Type</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>    
                <ModalBody>
                <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                    <FlexGridItem>
                        <Field
                            name="name"
                            type="text"
                            component={renderField}
                            label="Expense Type Name *"
                        />
                    </FlexGridItem>
                    <FlexGridItem>
                        <Field
                            name="category"
                            type="select"
                            component={renderSelectField}
                            label="Category *"
                            options={options}
                            placeholder="Select Category..."
                            disabled={false}
                            handleOptionChange={handleOptionChange}
                        />
                    </FlexGridItem>
                </FlexGrid>
                <FlexGrid flexGridColumnCount={3} flexGridColumnGap={"5px"} {...gridOverrides}>
                    <FlexGridItem {...checkboxItemOverrides}>
                        <Field
                            name="recurrent"
                            type="checkbox"
                            component={renderCheckboxField}
                            label="Recurrent"
                            handleCheckboxChange={handleCheckboxChange}
                        />
                    </FlexGridItem>
                    {recurrent && (
                        <>
                        <FlexGridItem>
                            <Field
                                name="endDate"
                                type="date"
                                component={renderDateField}
                                label="End Date"
                            />
                        </FlexGridItem>
                        <FlexGridItem>
                            <Field
                                name="baseValue"
                                type="number"
                                component={renderField}
                                label="Base Value *"
                            />
                        </FlexGridItem>
                        </>
                    )}
                </FlexGrid>
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary} onClick={() => onClose()} type={'button'}>
                    Cancel
                </ModalButton>
                <ModalButton type={'submit'} isLoading={isLoading}>
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
    
    if (!values.name) {
        errors.name = 'Required';
    }
    
    if (!values.category) {
        errors.category = 'Required';
    }
    
    if (values.recurrent && !values.baseValue) {
        errors.baseValue = 'Required';
    }
    
    return errors;
};

ExpenseTypeModal = reduxForm({
    form: 'expenseTypeForm',
    enableReinitialize: true,
    touchOnBlur: false,
    validate
})(ExpenseTypeModal);

export default connect()(ExpenseTypeModal);
