import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {LoadingScreen} from "@features/loadingScreen";
import React, {useEffect, useState} from "react";
import {Redirect} from "@features/redirect";

function SignIn() {
    const {data: session, status} = useSession();
    const loading = status === 'loading'
    const router = useRouter();

    const [error] = useState(router.asPath.includes("&error="));

    const {token} = router.query;
    const features = session?.data?.medical_entities?.find((entity: MedicalEntityDefault) => entity.is_default)?.features;

    useEffect(() => {
        if (status === "unauthenticated" && !error) {
            const hasRouterToken = router.asPath.includes("?token=");
            console.log('signIn page');
            signIn(hasRouterToken ? 'credentials' : 'keycloak',
                {
                    ...(hasRouterToken && {token}),
                    callbackUrl: `/${router.locale}`
                });
        }
    });

    if (loading) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        status === "unauthenticated" ?
            <LoadingScreen
                button
                {...{color: "error", ...(error && {text: "loading-error"})}}
            /> :
            <Redirect to={features?.length > 0 ? `/dashboard/${features[0].root}` : `/dashboard/agenda`}/>)
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu']))
    }
})

export default SignIn;
