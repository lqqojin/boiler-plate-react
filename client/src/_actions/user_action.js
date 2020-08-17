import axios from 'axios';
import { LOGIN_USER } from './types';

export function loginUser(dataToSubmit) {

    const request = axios.post('/api/user/login', dataToSubmit)
        .then(res => {
            console.log('%cdata', 'color:yellow', res.data);
            return res.data;
        });

    return {
        type: LOGIN_USER,
        payload: request
    }
}
