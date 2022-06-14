import type { NextPage } from 'next'
import styles from '@styles/Home.module.scss'
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import {
    SelectChangeEvent,
} from "@mui/material";
import {setTheme} from "@features/setConfig/actions";
import {useRouter} from "next/router";
import {useAppDispatch} from "@app/redux/hooks";
import dynamic from 'next/dynamic';
const Footer = dynamic(() => import('@features/base/footer'));
const SignIn = dynamic(() => import('./auth/signin'));

const Home: NextPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const dir = router.locale === 'ar' ? 'rtl': 'ltr';


    const { t, ready } = useTranslation(['common', 'menu']);

    if (!ready) return (<>loading translations...</>);

    const currentLang =  router.locale;
    const handleChange = (event: SelectChangeEvent) => {
        const lang = event.target.value as string;
        router.push(router.pathname, router.pathname, { locale: lang });
    };

    const toggleTheme = (mode: string) => {
        dispatch(setTheme(mode));
    }

  return (
    <div className={styles.container} dir={dir}>
        <main className={styles.main}>
            <SignIn />
        </main>

        <Footer/>
    </div>
  )
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common','menu']))
    }
})
export default Home
