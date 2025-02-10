import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { INCOME_TYPES_URL } from '../endpoints';

export const fetchIncomeType = async (incomeTypeId) => {
    const res = await axios.get(`${INCOME_TYPES_URL}/${incomeTypeId}`);
    return res.data;
};

export const useIncomeType = (incomeTypeId) => {
    return useQuery({
        queryKey: ['incomeType', incomeTypeId], 
        queryFn: () => {return fetchIncomeType(incomeTypeId)}
    });
};
