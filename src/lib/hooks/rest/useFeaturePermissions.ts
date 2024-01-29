import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useMedicalEntitySuffix} from "@lib/hooks";

function useFeaturePermissions(slug: string, enabled: boolean = false) {
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {data: httpPermissionsResponse, isLoading} = useRequestQuery(slug && enabled ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/features/${slug}/permissions/${router.locale}`,
    } : null, ReactQueryNoValidateConfig);

    return {
        permissions: (Array.isArray(httpPermissionsResponse) ? httpPermissionsResponse : ((httpPermissionsResponse as HttpResponse)?.data ?? [])) as PermissionModel[],
        isLoading
    }
}

export default useFeaturePermissions;
