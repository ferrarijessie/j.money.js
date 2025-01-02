import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { INCOME_TYPES_URL } from '../endpoints';


export const addIncomeType = async (payload = {}) => {
    const res = await axios.post(INCOME_TYPES_URL, payload);
    return res.data;
};

export const useIncomeTypePost = () => {
    return useMutation({mutationFn: payload => {
        return addIncomeType(payload);
    }});
};
