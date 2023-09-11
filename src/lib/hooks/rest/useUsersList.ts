import {useRequest} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";

function useUsersList() {
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {data: httpUsersResponse} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/users`
    }, SWRNoValidateConfig);

    return {users: (Array.isArray(httpUsersResponse) ? httpUsersResponse : ((httpUsersResponse as HttpResponse)?.data ?? [])) as UserModel[]}
}


export default useUsersList;
