import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { SAVINGS_URL } from '../endpoints';

export const fetchSavings = async (year, month) => {
    const res = await axios.get(`${SAVINGS_URL}/summary/${year}/${month}`);
    return res.data;
};

export const useSavingsList = (year, month) => {
    return useQuery({
        queryKey: ['savingsList', year, month], 
        queryFn: () => {return fetchSavings(year, month)}
    });
};
