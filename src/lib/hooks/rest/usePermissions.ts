import {useRequest} from "@lib/axios";
import {useSession} from "next-auth/react";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useEffect, useState} from "react";

function usePermissions() {
    const {data: session} = useSession();

    const [permissions, setPermissions] = useState<any>(null);

    const {data: httpPermissionsResponse} = useRequest({
        method: "GET",
        url: "/api/medical-entity/permissions",
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    }, SWRNoValidateConfig);

    const hasPermission = (permissionName: PermissionName) => {
        return !!permissions[permissionName];
    }

    useEffect(() => {
        if (httpPermissionsResponse) {
            setPermissions((httpPermissionsResponse as HttpResponse)?.data as PermissionModel[]);
        }
    }, [httpPermissionsResponse])

    return {permissions, hasPermission};
}

export default usePermissions;
