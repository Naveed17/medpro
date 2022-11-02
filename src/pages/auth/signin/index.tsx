import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {LoadingScreen} from "@features/loadingScreen";
import React, {useEffect, useState} from "react";
import {Redirect} from "@features/redirect";

function SignIn() {
    const {status} = useSession();
    const loading = status === 'loading'
    const router = useRouter();
    const [error, setError] = useState(router.asPath.includes("&error="));
    const [errorText, setErrorText] = useState(router.asPath.includes("&error=") && "une erreur s'est produite pendant la phase d'initialisation. cliquez sur le login pour réessayer");
    const {token} = router.query;

    useEffect(() => {
        if (status === "unauthenticated" && !error) {
            if (router.asPath.includes("?token=")) {
                signIn('credentials', {
                    token,
                    callbackUrl: (router.locale === 'ar' ? '/ar/dashboard/agenda' : '/dashboard/agenda')
                });
            } else {
                signIn('keycloak',
                    {
                        callbackUrl: (router.locale === 'ar' ? '/ar/dashboard/agenda' : '/dashboard/agenda')
                    });
            }
        }
    });

    if (loading) return (<LoadingScreen/>);

    return (
        status === "unauthenticated" ?
            <LoadingScreen
                {...{error, ...(error && {text: errorText})}}
            /> :
            <Redirect to='/dashboard/agenda'/>)
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu']))
    }
})

export default SignIn;
