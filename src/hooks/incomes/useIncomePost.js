import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { INCOMES_URL } from '../endpoints';


export const addIncome = async (payload = {}) => {
    const res = await axios.post(`${INCOMES_URL}/`, payload);
    return res.data;
};

export const useIncomePost = () => {
    return useMutation({mutationFn: payload => {
        return addIncome(payload);
    }});
};
