// import axios from 'axios';
// import { getSession } from 'next-auth/react';
//
import {getSession} from "next-auth/react";

const baseURL: string = process.env.NEXT_APP_BACK_END_POINT || 'http://localhost:3000';
// let accessToken: string = '';
// let refreshToken = '';
//
// const ApiClient = () => {
//
//     const defaultOptions = {
//         baseURL,
//     };
//
//     const instance = axios.create(defaultOptions);
//
//     instance.interceptors.request.use(async (req: any) => {
//         if (accessToken !== '') {
//             req.headers.Authorization = `Bearer ${accessToken}`;
//         }
//         return req;
//     });
//
//     instance.interceptors.response.use(
//         (response) => {
//             return response;
//         },
//         (error) => {
//             console.log(`error`, error);
//         },
//     );
//
//     return instance;
// };
//
// export default ApiClient();

import axios from "axios";

export const setAxiosToken = (access_token: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
}

export const clientAxios = (() => {
    return axios.create({
        baseURL,
        headers: {
            Accept: "application/json"
        }
    });
})();

export const clientAxiosAbsolute = (() => {
    return axios.create({
        headers: {
            Accept: "application/json"
        }
    });
})();

// the request function which will destructure the response
export const requestAxios = async  (options: any) =>{
    // success handler
    const onSuccess =  (response: any) =>{
        const {
            data: { message }
        } = response;
        return message;
    };

    // error handler
    const onError =  (error: any) =>{
        return Promise.reject(error.response);
    };

    // adding success and error handlers to client
    return clientAxios(options).then(onSuccess).catch(onError);
};

export default clientAxios;
