import useSWR, {SWRConfiguration, SWRResponse} from 'swr'
import axios, {AxiosRequestConfig, AxiosResponse, AxiosError, Axios} from 'axios'

const baseURL: string = process.env.NEXT_PUBLIC_BACK_END_POINT || 'https://coreapi.med.ovh/';

export type GetRequest = AxiosRequestConfig | null

export const instanceAxios = (() => {
    return axios.create({
        baseURL,
        headers: {
            Accept: "application/json",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        }
    });
})();

interface Return<Data, Error>
    extends Pick<SWRResponse<AxiosResponse<Data>, AxiosError<Error>>,
        'isValidating' | 'error' | 'mutate'> {
    data: Data | undefined
    response: AxiosResponse<Data> | undefined
}

export interface Config<Data = unknown, Error = unknown>
    extends Omit<SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>,
        'fallbackData'> {
    fallbackData?: Data
}

function useRequest<Data = unknown, Error = unknown>(
    request: GetRequest,
    {fallbackData, ...config}: Config<Data, Error> = {}
): Return<Data, Error> {
    const {
        data: response,
        error,
        isValidating,
        mutate
    } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
        request && JSON.stringify(request),
        /**
         * NOTE: Typescript thinks `request` can be `null` here, but the fetcher
         * function is actually only called by `useSWR` when it isn't.
         */
        () => instanceAxios.request<Data>(request!),
        {
            ...config,
            fallbackData: fallbackData && {
                status: 200,
                statusText: 'InitialData',
                config: request!,
                headers: {},
                data: fallbackData
            }
        }
    )

    return {
        data: response && response.data,
        response,
        error,
        isValidating,
        mutate
    }
}

// export default UseRequest;


let instance: Axios;

async function get(URL: string, params?: any, headers?: any) {
    let query = '';
    if (params !== undefined) {
        const searchParams = new URLSearchParams(params)
        query = `?${searchParams.toString()}`
    }

    return axios.get(`${URL}`, {
        headers: {
            accept: `application/json`
        }
    });
}

const post = (URL: string, body: any) => axios.post(`${baseURL}/${URL}`, body)

const put = (URL: string, body: any) => axios.put(`${baseURL}/${URL}`, body)

const deletes = (URL: string) => axios.delete(`${baseURL}/${URL}`)

const patch = (URL: string) => axios.patch(`${baseURL}/${URL}`)

const ApiService = {
    get,
    post,
    put,
    deletes,
    patch,
}

export default useRequest;
