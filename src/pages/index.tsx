import styles from '@styles/Home.module.scss'
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import {
    SelectChangeEvent,
} from "@mui/material";
import {setTheme} from "@features/base/actions";
import {useRouter} from "next/router";
import {useAppDispatch} from "@app/redux/hooks";
import {signIn, useSession} from "next-auth/react";
import {useEffect} from "react";
import {LoadingScreen} from "@features/loadingScreen";

function Home() {
    const router = useRouter();
    const {status} = useSession();
    const dispatch = useAppDispatch();
    const dir = router.locale === 'ar' ? 'rtl' : 'ltr';

    const {t, ready} = useTranslation(['common', 'menu']);

    const currentLang = router.locale;
    const handleChange = (event: SelectChangeEvent) => {
        const lang = event.target.value as string;
        router.push(router.pathname, router.pathname, {locale: lang});
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            signIn('keycloak', {callbackUrl: (router.locale === 'ar' ? '/ar/dashboard/agenda' : '/dashboard/agenda')});

        } else if (status === "authenticated") {
            void router.push(router.locale === 'ar' ? '/ar/dashboard/agenda' : '/dashboard/agenda');
        }
    }, [router, status]);

    const toggleTheme = (mode: string) => {
        dispatch(setTheme(mode));
    }

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <div className={styles.container} dir={dir}>
            {/*<main className={styles.main}>
                <SignInComponent/>
            </main>

            <Footer/>*/}
        </div>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu']))
    }
})
export default Home;
