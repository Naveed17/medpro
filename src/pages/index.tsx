import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useRouter} from "next/router";
import {signIn, useSession} from "next-auth/react";
import {useEffect} from "react";

function Home() {
    const router = useRouter();
    const {status} = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            signIn('keycloak', {callbackUrl: (router.locale === 'ar' ? '/ar/dashboard/agenda' : '/dashboard/agenda')});

        } else if (status === "authenticated") {
            void router.push(router.locale === 'ar' ? '/ar/dashboard/agenda' : '/dashboard/agenda');
        }
    }, [router, status]);

}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu']))
    }
})
export default Home;
