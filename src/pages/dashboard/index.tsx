import styles from "@styles/Home.module.scss";
import {GetStaticProps, NextPage} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import dynamic from 'next/dynamic';
const SideBarMenu = dynamic(() => import('@features/sideBarMenu/components/sideBarMenu'))

const Index: NextPage = () => {

    const { t, ready } = useTranslation('common');
    if (!ready) return (<>loading translations...</>);

    return(
        <main className={styles.main}>
            <SideBarMenu />
        </main>
        )
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu']))
    }
})
export default Index
