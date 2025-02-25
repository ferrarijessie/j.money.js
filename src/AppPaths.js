// MANAGER
export const MANAGER_PATH = '/manager';

export const PROFILE_MANAGER_PATH = `${MANAGER_PATH}/profile`;

export const EXPENSES_MANAGER_PATH = `${MANAGER_PATH}/expenses`;
export const EXPENSE_TYPES_MANAGER_PATH = `${EXPENSES_MANAGER_PATH}/types`;
export const EXPENSE_TYPE_DETAILS_PATH = `${EXPENSE_TYPES_MANAGER_PATH}/:id`;
export const EXPENSE_VALUES_MANAGER_PATH = `${EXPENSES_MANAGER_PATH}/values`;

export const INCOMES_MANAGER_PATH = `${MANAGER_PATH}/incomes`;
export const INCOME_TYPES_MANAGER_PATH = `${INCOMES_MANAGER_PATH}/types`;
export const INCOME_TYPE_DETAILS_PATH = `${INCOME_TYPES_MANAGER_PATH}/:id`;
export const INCOME_VALUES_MANAGER_PATH = `${INCOMES_MANAGER_PATH}/values`;

export const SAVINGS_MANAGER_PATH = `${MANAGER_PATH}/savings`;
export const SAVING_TYPES_MANGER_PATH = `${SAVINGS_MANAGER_PATH}/types`;
export const SAVING_TYPE_DETAILS_PATH = `${SAVING_TYPES_MANGER_PATH}/:id`;
export const SAVING_VALUES_MANAGER_PATH = `${SAVINGS_MANAGER_PATH}/values`;
