import useSWRMutation, {SWRMutationConfiguration} from "swr/mutation";
import {AxiosError, AxiosResponse} from "axios";
import {GetRequest} from "../axios/config";
import {instanceAxios} from "../axios";
import {Key, SWRResponse} from "swr";


interface SWRMutationResponse<Data = any, Error = any, ExtraArg = never, SWRMutationKey extends Key = Key> extends Pick<SWRResponse<Data, Error>, 'data' | 'error'> {
    /**
     * Indicates if the mutation is in progress.
     */
    isMutating: boolean;
    /**
     * Function to trigger the mutation. You can also pass an extra argument to
     * the fetcher, and override the options for the mutation hook.
     */
    trigger: [ExtraArg] extends [never] ? <SWRData = Data>(extraArgument?: any, options?: SWRMutationConfiguration<Data, Error, ExtraArg, SWRMutationKey, SWRData>) => Promise<Data | undefined> : <SWRData = Data>(extraArgument: ExtraArg, options?: SWRMutationConfiguration<Data, Error, ExtraArg, SWRMutationKey, SWRData>) => Promise<Data | undefined>;
    /**
     * Function to reset the mutation state (`data`, `error`, and `isMutating`).
     */
    reset: () => void;
}

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
    key?: string,
    {fallbackData, ...config}: any = {}
): ReturnMutation<DataMutation, Error> {

    const {
        data: response,
        error,
        trigger,
        isMutating,
        reset
    } = useSWRMutation<AxiosResponse<DataMutation>, AxiosError<Error>>(
        key ? key : request?.url,
        (key: string, requestConfig: any) => instanceAxios.request<DataMutation>(requestConfig!.arg),
        {...config}
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
