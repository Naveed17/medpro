import axios, {AxiosRequestConfig} from "axios";

const baseURL: string = process.env.NEXT_PUBLIC_BACK_END_POINT || 'https://coreapi.med.ovh/';

export type GetRequest = AxiosRequestConfig | null

export const setAxiosToken = (access_token: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
}

const instanceAxios = (() => {
    return axios.create({
        baseURL,
        headers: {
            Accept: "application/json",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        }
    });
})();

export default instanceAxios;
