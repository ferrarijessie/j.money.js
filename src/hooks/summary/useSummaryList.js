import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { SUMMARY_URL } from '../endpoints';

export const fetchSummaryList = async (year, month) => {
    const res = await axios.get(`${SUMMARY_URL}/list/${year}/${month}`);
    return res.data;
};

export const useSummaryList = (year, month) => {
    return useQuery({
        queryKey: ['summaryList', year, month], 
        queryFn: () => {return fetchSummaryList(year, month)}
    });
};
