import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { SAVINGS_SUMMARY_URL } from '../endpoints';

export const fetchSavingSummary = async (year, month) => {
    const res = await axios.get(`${SAVINGS_SUMMARY_URL}/${year}/${month}`);
    return res.data;
};

export const useSavingSummary = (year, month) => {
    return useQuery({
        queryKey: ['savingSummary', year, month], 
        queryFn: () => {return fetchSavingSummary(year, month)}
    });
};
