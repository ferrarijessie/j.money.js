import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { INCOMES_URL } from '../endpoints';


export const deleteIncome = async (id) => {
    const res = await axios.delete(`${INCOMES_URL}/${id}`);
    return res.data;
};

export const useIncomeDelete = () => {
    return useMutation({mutationFn: id => {
        return deleteIncome(id);
    }});
};
