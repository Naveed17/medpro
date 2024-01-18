import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useMedicalEntitySuffix} from "@lib/hooks";

function useFeaturePermissions(slug: string) {
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {data: httpPermissionsResponse, isLoading} = useRequestQuery(slug ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/features/${slug}/profiles/${router.locale}`,
    } : null, ReactQueryNoValidateConfig);

    return {
        permissions: (Array.isArray(httpPermissionsResponse) ? httpPermissionsResponse : ((httpPermissionsResponse as HttpResponse)?.data ?? [])) as PermissionModel[],
        isLoading
    }
}

export default useFeaturePermissions;
