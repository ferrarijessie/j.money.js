import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { EXPENSES_URL } from '../endpoints';

export const fetchExpensesList = async (category, year, month) => {
    const res = await axios.get(`${EXPENSES_URL}/${category}/${year}/${month}`);
    return res.data;
};

export const useExpensesList = (category, year, month) => {
    return useQuery({
        queryKey: ['expensesList', category, year, month], 
        queryFn: () => {return fetchExpensesList(category, year, month)}
    });
};
