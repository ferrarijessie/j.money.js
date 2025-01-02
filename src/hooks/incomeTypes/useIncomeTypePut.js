import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { INCOME_TYPES_URL } from '../endpoints';


export const updateIncomeType = async ({id, payload = {}}) => {
    const res = await axios.put(`${INCOME_TYPES_URL}/${id}`, payload);
    return res.data;
};

export const useIncomeTypePut = () => {
    return useMutation({mutationFn: ({id, payload}) => {
        return updateIncomeType({id, payload});
    }});
};