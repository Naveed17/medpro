import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import React, {useEffect} from "react";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {useTranslation} from "next-i18next";
import LockIcon from "@themes/overrides/icons/lockIcon";
import {setLock} from "@features/appLock";
import {toggleSideBar} from "@features/menu";
import {useAppDispatch} from "../redux/hooks";

function AuthGuard({children}: LayoutProps) {
    const {data: session, status} = useSession();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {t} = useTranslation('common');

    const roles = (session?.data as UserDataResponse)?.general_information.roles as Array<string>
    const userPermission = [
        "/dashboard/settings/profil",
        "/dashboard/settings/acts",
        "/dashboard/settings/actfees",
        "/dashboard/consultation/[uuid-consultation]"
    ];

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
    if (status === "loading" || status === "unauthenticated") {
        return <LoadingScreen/>
    }

    if (userPermission.includes(router.pathname) && roles.includes('ROLE_SECRETARY')) {
        return <LoadingScreen text={t("permission")} iconNote={<LockIcon/>} button={'back'}/>
    }

    return <>{children}</>;
}

export default AuthGuard;
