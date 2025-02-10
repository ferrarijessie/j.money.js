import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { INCOMES_URL } from '../endpoints';

export const fetchIncomes = async () => {
    const res = await axios.get(`${INCOMES_URL}`);
    return res.data;
};

export const useIncomes = () => {
    return useQuery({
        queryKey: ['incomes'], 
        queryFn: () => {return fetchIncomes()}
    });
};
