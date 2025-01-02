import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { SAVINGS_URL } from '../endpoints';

export const fetchSavings = async () => {
    const res = await axios.get(SAVINGS_URL);
    return res.data;
};

export const useSavingsList = () => {
    return useQuery({
        queryKey: ['savingsList'], 
        queryFn: fetchSavings
    });
};
