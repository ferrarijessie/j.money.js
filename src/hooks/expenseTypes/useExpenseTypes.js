import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { EXPENSE_TYPES_URL } from '../endpoints';

export const fetchExpenseTypes = async () => {
    const res = await axios.get(EXPENSE_TYPES_URL);
    return res.data;
};

export const useExpenseTypes = () => {
    return useQuery({
        queryKey: ['expenseTypes'], 
        queryFn: fetchExpenseTypes
    });
};
