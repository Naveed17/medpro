export const getPermissionsCount = (role: FeatureModel[]) => {
    return role.reduce((features: any[], feature: FeatureModel) =>
        [...(features ?? []),
            ...(feature?.hasOwnProperty("featureEntity") && feature?.featureEntity?.checked || !feature?.hasOwnProperty("featureEntity") ?
                feature?.permissions?.reduce((permissions: any[], permission: PermissionModel) =>
                    [...(permissions ?? []),
                        ...(permission.children?.filter(permission => permission?.checked) ?? [])], []) ?? [] : [])], [])?.length;
}
