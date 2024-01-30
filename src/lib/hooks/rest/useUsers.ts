import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useMedicalEntitySuffix} from "@lib/hooks";

function useUsers(enable: boolean = true) {
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {data: httpUsersResponse, isLoading} = useRequestQuery(enable ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehus/${router.locale}`,
    } : null, ReactQueryNoValidateConfig);

    return {
        users: (Array.isArray(httpUsersResponse) ? httpUsersResponse : ((httpUsersResponse as HttpResponse)?.data ?? [])) as UserModel[],
        isLoading
    }
}

export default useUsers;
