import useSWRMutation, {SWRMutationConfiguration, SWRMutationResponse} from "swr/mutation";
import axios, {Axios, AxiosError, AxiosResponse} from "axios";
import {GetRequest} from "@app/axios/config";
import {instanceAxios} from "@app/axios";


interface ReturnMutation<DataMutation, Error>
    extends Pick<SWRMutationResponse<AxiosResponse<DataMutation>, AxiosError<Error>>,
        'isMutating' | 'error' | 'trigger' | 'reset'> {
    data: DataMutation | undefined
    response: AxiosResponse<DataMutation> | undefined
}

export interface ConfigMutation<Data = unknown, Error = unknown>
    extends Omit<SWRMutationConfiguration<AxiosResponse<Data>, AxiosError<Error>>,
        'fallbackData'> {
    fallbackData?: Data
}

function useRequestMutation<DataMutation = unknown, Error = unknown>(
    request: GetRequest,
    {fallbackData, ...config}: ConfigMutation<DataMutation, Error> = {}
): ReturnMutation<DataMutation, Error> {

    const {
        data: response,
        error,
        trigger,
        isMutating,
        reset
    } = useSWRMutation<AxiosResponse<DataMutation>, AxiosError<Error>>(
        request && JSON.stringify(request),
        (key: string, requestConfig: any) => instanceAxios.request<DataMutation>(requestConfig!.arg),
        {
            ...config
        }
    )

    return {
        data: response && response.data,
        response,
        error,
        trigger,
        isMutating,
        reset
    }
}

export default useRequestMutation
