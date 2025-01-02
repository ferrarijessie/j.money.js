import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { EXPENSE_TYPES_URL } from '../endpoints';


export const addExpenseType = async (payload = {}) => {
    const res = await axios.post(EXPENSE_TYPES_URL, payload);
    return res.data;
};

export const useExpenseTypesPost = () => {
    return useMutation({mutationFn: payload => {
        return addExpenseType(payload);
    }});
};
