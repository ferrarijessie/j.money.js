import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { INCOME_TYPES_URL } from '../endpoints';


export const deleteIncomeType = async (id) => {
    const res = await axios.delete(`${INCOME_TYPES_URL}/${id}`);
    return res.data;
};

export const useIncomeTypeDelete = () => {
    return useMutation({mutationFn: id => {
        return deleteIncomeType(id);
    }});
};
