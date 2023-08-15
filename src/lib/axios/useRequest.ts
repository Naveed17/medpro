import useSWR, {SWRConfiguration, SWRResponse} from "swr";
import {AxiosResponse, AxiosError} from "axios";
import {instanceAxios} from "../axios";
import {GetRequest} from "../axios/config";
import {Fetcher} from "swr/_internal";
import {useSession} from "next-auth/react";

interface Return<Data, Error>
    extends Pick<
        SWRResponse<AxiosResponse<Data>, AxiosError<Error>>,
        "isValidating" | "isLoading" | "error" | "mutate"
    > {
    data: Data | undefined;
    response: AxiosResponse<Data> | undefined;
}

export interface Config<Data = unknown, Error = unknown>
    extends Omit<
        SWRConfiguration<Data, Error, Fetcher<Data, any>> | undefined,
        "fallbackData"
    > {
    fallbackData?: Data | undefined;
}

function useRequest<Data = unknown, Error = unknown>(request: GetRequest, {
    fallbackData,
    ...config
}: any = {}): Return<Data, Error> {
    const {data: session} = useSession();

    const {
        data: response,
        error,
        isValidating,
        isLoading,
        mutate,
    } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
        request && request.url,
        () => instanceAxios.request<Data>({...request, ...(!request?.url?.includes("/api/public") && {headers: {Authorization: `Bearer ${session?.accessToken}`}})}!),
        {
            ...config,
            fallbackData: fallbackData && {
                status: 200,
                statusText: "InitialData",
                config: request!,
                headers: {},
                data: fallbackData,
            }
        }
    );

    return {
        data: response && response.data,
        response,
        error,
        isValidating,
        isLoading,
        mutate,
    };
}

export default useRequest;
