import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { SAVINGS_URL } from '../endpoints';


export const addSaving = async (payload = {}) => {
    const res = await axios.post(`${SAVINGS_URL}/`, payload);
    return res.data;
};

export const useSavingPost = () => {
    return useMutation({mutationFn: payload => {
        return addSaving(payload);
    }});
};
