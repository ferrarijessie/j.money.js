import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { EXPENSES_URL } from '../endpoints';


export const deleteExpense = async (id) => {
    const res = await axios.delete(`${EXPENSES_URL}/${id}`);
    return res.data;
};

export const useExpenseDelete = () => {
    return useMutation({mutationFn: id => {
        return deleteExpense(id);
    }});
};
