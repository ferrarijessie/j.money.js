import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { SAVINGS_URL } from '../endpoints';


export const updateSaving = async ({id, payload = {}}) => {
    const res = await axios.put(`${SAVINGS_URL}/${id}`, payload);
    return res.data;
};

export const useSavingPut = () => {
    return useMutation({mutationFn: ({id, payload}) => {
        return updateSaving({id, payload});
    }});
};
