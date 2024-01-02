import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import React, {useEffect} from "react";
import {LoadingScreen} from "@features/loadingScreen";
import LockIcon from "@themes/overrides/icons/lockIcon";
import {setLock} from "@features/appLock";
import {toggleSideBar} from "@features/menu";
import {useAppDispatch} from "../redux/hooks";

function AuthGuard({children}: LayoutProps) {
    const {data: session, status} = useSession();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const medical_entity = (session?.data as UserDataResponse)?.medical_entities?.find((entity: MedicalEntityDefault) => entity.is_default);
    const features = medical_entity?.features;
    const isOwner = medical_entity?.is_owner;
    const hasPermission = features?.map((feature: FeatureModel) => feature.slug).includes(router.pathname.split('/')[2]) ?? true;
    const hasMultiMedicalEntities = session?.data?.medical_entities?.length > 1 ?? false;
    console.log('AuthGuard session', hasMultiMedicalEntities);
    useEffect(() => {
        if (localStorage.getItem('lock-on') === 'true') {
            dispatch(setLock(true));
            dispatch(toggleSideBar(true));
        }
    }, [dispatch]);

    useEffect(() => {
        if (status === "unauthenticated" && router.asPath !== "/auth/signIn") {
            signIn('keycloak', {callbackUrl: (router.locale === 'ar' ? '/ar/dashboard/agenda' : '/dashboard/agenda')});
        }
    }, [status, router]);

    useEffect(() => {
        // check if the error has occurred
        if (session?.error === "RefreshAccessTokenError") {
            signIn('keycloak', {
                callbackUrl: `${router.locale}/dashboard/agenda`,
            }); // Force sign in to hopefully resolve error
        }
    }, [session?.error, router]);
    // Make sure that you show a loading state for BOTH loading and unauthenticated.
    // This is because when status becomes `unathenticated` the component renders,
    // returns children and then the useEffect redirect is fired afterward,
    // hence the temporary flash of the child content.
    if (!session?.user?.hasOwnProperty('jti') && (status === "loading" || status === "unauthenticated")) {
        return <LoadingScreen/>
    }

    if (!hasPermission && router.pathname !== '/dashboard' && !isOwner) {
        console.log("auth guard loading")
        return <LoadingScreen
            text={"permission"}
            iconNote={<LockIcon/>}
            button={'back'}
            OnClick={() => router.push("/dashboard")}/>
    }

    return <>{children}</>;
}

export default AuthGuard;
