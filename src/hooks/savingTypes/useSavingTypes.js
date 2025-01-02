import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { SAVING_TYPES_URL } from '../endpoints';

export const fetchSavingTypes = async () => {
    const res = await axios.get(SAVING_TYPES_URL);
    return res.data;
};

export const useSavingTypes = () => {
    return useQuery({
        queryKey: ['savingTypes'], 
        queryFn: fetchSavingTypes
    });
};
