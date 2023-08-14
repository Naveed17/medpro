import {useRequest} from "@lib/axios";
import {useSession} from "next-auth/react";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";

function usePermissions() {
    const {data: session} = useSession();

    const {data: httpPermissionsResponse} = useRequest({
        method: "GET",
        url: "/api/medical-entity/permissions"
    }, SWRNoValidateConfig);

    const hasPermission = (permissionName: PermissionName) => {
        return !!((httpPermissionsResponse as HttpResponse)?.data ?? [])[permissionName];
    }

    return {permissions: (httpPermissionsResponse as HttpResponse)?.data ?? [], hasPermission};
}

export default usePermissions;
