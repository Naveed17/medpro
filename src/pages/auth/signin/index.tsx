import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {LoadingScreen} from "@features/loadingScreen";
import React, {useEffect} from "react";
import {Redirect} from "@features/redirect";

function SignIn() {
    const {status} = useSession();
    const loading = status === 'loading'
    const router = useRouter();
    const {token} = router.query;

    useEffect(() => {
        if (status === "unauthenticated") {
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
            <LoadingScreen/> :
            <Redirect to='/dashboard/agenda'/>)
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu']))
    }
})

export default SignIn;
