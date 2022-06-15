import useSWR, { SWRConfiguration, SWRResponse } from 'swr'
import axios, {AxiosRequestConfig, AxiosResponse, AxiosError, Axios} from 'axios'
import {getSession, useSession} from "next-auth/react";
import {ApiClient} from "@app/axios/index";
import request from "@app/axios/config";
import clientAxios from "@app/axios/config";

export type GetRequest = AxiosRequestConfig | null

interface Return<Data, Error>
    extends Pick<
        SWRResponse<AxiosResponse<Data>, AxiosError<Error>>,
        'isValidating' | 'error' | 'mutate'
        > {
    data: Data | undefined
    response: AxiosResponse<Data> | undefined
}

export interface Config<Data = unknown, Error = unknown>
    extends Omit<
        SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>,
        'fallbackData'
        > {
    fallbackData?: Data
}

function UseRequest<Data = unknown, Error = unknown>(
    request: GetRequest,
    { fallbackData, ...config }: Config<Data, Error> = {}
): Return<Data, Error> {
    const {
        data: response,
        error,
        isValidating,
        mutate
    } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
        request && JSON.stringify(request),
        () => axios.request<Data>(request!),
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

const baseURL = process.env.NEXT_APP_BACK_END_POINT
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

export default ApiService
