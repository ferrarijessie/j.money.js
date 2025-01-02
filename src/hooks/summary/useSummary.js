import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { SUMMARY_URL } from '../endpoints';

export const fetchSummary = async (year, month) => {
    const res = await axios.get(`${SUMMARY_URL}/${year}/${month}`);
    return res.data;
};

export const useSummary = (year, month) => {
    return useQuery({
        queryKey: ['summary', year, month], 
        queryFn: () => {return fetchSummary(year, month)}
    });
};
