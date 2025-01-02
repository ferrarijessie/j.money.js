import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { EXPENSES_URL } from '../endpoints';


export const updateExpense = async ({id, payload = {}}) => {
    const res = await axios.put(`${EXPENSES_URL}/${id}`, payload);
    return res.data;
};

export const useExpensePut = () => {
    return useMutation({mutationFn: ({id, payload}) => {
        return updateExpense({id, payload});
    }});
};
