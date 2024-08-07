import axios, {AxiosRequestConfig} from "axios";

const baseURL: string = process.env.NEXT_PUBLIC_API_URL || "";

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

instanceAxios.interceptors.response.use((response) => response, (error) => {
    // whatever you want to do with the error
    switch (error.response?.status) {
        case 401:
            console.log("Token expired");
            break;
    }
    throw error;
});
export default instanceAxios;
