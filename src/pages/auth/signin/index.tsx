import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {LoadingScreen} from "@features/loadingScreen";
import React, {useEffect, useState} from "react";
import {Redirect} from "@features/redirect";
import {useAppSelector} from "@app/redux/hooks";
import {profileMenuSelector} from "@features/profilMenu";
import axios from "axios";

function SignIn() {
    const {status} = useSession();
    const loading = status === 'loading'
    const router = useRouter();

    const {logout} = useAppSelector(profileMenuSelector);
    const [error, setError] = useState(router.asPath.includes("&error="));
    const {token} = router.query;

    useEffect(() => {
        if (status === "unauthenticated" && !error) {
            signIn(router.asPath.includes("?token=") ? 'credentials' : 'keycloak', {
                ...(router.asPath.includes("?token=") && {token}),
                callbackUrl: (router.locale === 'ar' ? '/ar/dashboard/agenda' : '/dashboard/agenda')
            });
        }
    });

    if (loading) return (<LoadingScreen/>);

    return (
        status === "unauthenticated" ?
            <LoadingScreen
                {...{error, ...(error && {text: "loading-error"})}}
            /> :
            <Redirect to='/dashboard/agenda'/>)
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu']))
    }
})

export default SignIn;
