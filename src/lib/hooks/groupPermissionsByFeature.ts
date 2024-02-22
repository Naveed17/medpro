export const groupPermissionsByFeature = (permissions: PermissionModel[]) => {
    const groupedPermissions = permissions.group((permission: PermissionModel) => permission.slug?.split("__")[1]);
    return Object.entries(groupedPermissions).reduce((groups: any[], group: any) => [...(groups ?? []), {
        name: group[0],
        uuid: group[0],
        checkAll: false,
        collapseIn: false,
        children: group[1]
    }], []);
}
