import {useRequestQuery} from "@lib/axios";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";

function usePermissions() {
    const {data: httpPermissionsResponse} = useRequestQuery({
        method: "GET",
        url: "/api/medical-entity/permissions"
    }, ReactQueryNoValidateConfig);

    const hasPermission = (permissionName: PermissionName) => {
        return !!((httpPermissionsResponse as HttpResponse)?.data ?? [])[permissionName];
    }

    return {permissions: (httpPermissionsResponse as HttpResponse)?.data ?? [], hasPermission};
}

export default usePermissions;
