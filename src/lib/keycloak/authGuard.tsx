import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import React, {useEffect} from "react";
import {LoadingScreen} from "@features/loadingScreen";
import LockIcon from "@themes/overrides/icons/lockIcon";

function AuthGuard({children}: LayoutProps) {
    const {data: session, status} = useSession();
    const router = useRouter();

    const medical_entity = (session?.data as UserDataResponse)?.medical_entities?.find((entity: MedicalEntityDefault) => entity.is_default);
    const features = medical_entity?.features;
    const routerPathname = router.pathname;

    const hasAdminAccess = true;
    const slugFeature = routerPathname.split('/')[2] === "payment" ? "cashbox" : routerPathname.split('/')[2];
    const hasFeatureAccess = features?.find((feature: FeatureModel) => slugFeature?.includes(feature.slug)) ?? false;

    useEffect(() => {
        // check if the error has occurred
        if (session?.error === "RefreshAccessTokenError" || (status === "unauthenticated" && !["/auth/signIn", "/", `/${router.locale}`].includes(router.asPath))) {
            signIn('keycloak', {callbackUrl: `/${router.locale}`}); // Force sign in to hopefully resolve error
        }
    }, [session, router, status]);
    // Make sure that you show a loading state for BOTH loading and unauthenticated.
    // This is because when status becomes `unathenticated` the component renders,
    // returns children and then the useEffect redirect is fired afterward,
    // hence the temporary flash of the child content.
    if (!session?.user?.hasOwnProperty('jti') && (status === "loading" || status === "unauthenticated")) {
        return <LoadingScreen/>
    }

    if (!hasAdminAccess && router.pathname.includes("/admin/") || !hasFeatureAccess && router.pathname.includes("/dashboard/")) {
        console.log("auth guard loading")
        return <LoadingScreen
            text={"permission"}
            iconNote={<LockIcon/>}
            button={'back'}
            OnClick={() => router.push("/dashboard")}/>
    }

    return children;
}

export default AuthGuard;
