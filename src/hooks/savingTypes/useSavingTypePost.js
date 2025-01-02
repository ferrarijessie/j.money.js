import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { SAVING_TYPES_URL } from '../endpoints';


export const addSavingType = async (payload = {}) => {
    const res = await axios.post(SAVING_TYPES_URL, payload);
    return res.data;
};

export const useSavingTypePost = () => {
    return useMutation({mutationFn: payload => {
        return addSavingType(payload);
    }});
};
