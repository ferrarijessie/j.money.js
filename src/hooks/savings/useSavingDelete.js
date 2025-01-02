import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { SAVINGS_URL } from '../endpoints';


export const deleteSaving = async (id) => {
    const res = await axios.delete(`${SAVINGS_URL}/${id}`);
    return res.data;
};

export const useSavingDelete = () => {
    return useMutation({mutationFn: id => {
        return deleteSaving(id);
    }});
};
