import useSWRMutation, {SWRMutationConfiguration} from "swr/mutation";
import {AxiosError, AxiosResponse} from "axios";
import {GetRequest} from "../axios/config";
import {instanceAxios} from "../axios";
import {Key, SWRResponse} from "swr";
import {useSession} from "next-auth/react";

interface SWRMutationResponse<Data = any, Error = any, SWRMutationKey extends Key = Key, ExtraArg = never> extends Pick<SWRResponse<Data, Error>, 'data' | 'error'> {
    /**
     * Indicates if the mutation is in progress.
     */
    isMutating: boolean;
    /**
     * Function to trigger the mutation. You can also pass an extra argument to
     * the fetcher, and override the options for the mutation hook.
     */
    trigger: [ExtraArg] extends [never] ? <SWRData = Data>(extraArgument?: any, options?: SWRMutationConfiguration<Data, Error, SWRMutationKey, ExtraArg, SWRData>) => Promise<Data | undefined> : <SWRData = Data>(extraArgument: ExtraArg, options?: SWRMutationConfiguration<Data, Error, SWRMutationKey, ExtraArg, SWRData>) => Promise<Data | undefined>;
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

function useRequestMutation<DataMutation = unknown, Error = unknown>(
    request: GetRequest,
    key?: string,
    {fallbackData, ...config}: any = {}
): ReturnMutation<DataMutation, Error> {
    const {data: session} = useSession();
    const {jti} = session?.user as any;

    const {
        data: response,
        error,
        trigger,
        isMutating,
        reset
    } = useSWRMutation<AxiosResponse<DataMutation>, AxiosError<Error>>(
        key ? key : request?.url,
        (key: string, requestConfig: any) => instanceAxios.request<DataMutation>({
            ...requestConfig.arg, ...(!requestConfig?.arg?.url?.includes("/api/public") && {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    fcm_session: jti
                }
            })
        }!),
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
