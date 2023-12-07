import {useRequestQuery} from "@lib/axios";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";

function usePermissions() {
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {data: httpPermissionsResponse} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/permissions/${router.locale}`
    }, ReactQueryNoValidateConfig);

    const hasPermission = (permissionName: PermissionName) => {
        return !!((httpPermissionsResponse as HttpResponse)?.data ?? [])[permissionName];
    }

    return {permissions: (httpPermissionsResponse as HttpResponse)?.data ?? [], hasPermission};
}

export default usePermissions;
