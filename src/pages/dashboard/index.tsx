import styles from "@styles/Home.module.scss";
import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {ReactElement} from "react";
import dynamic from "next/dynamic";
const DashLayout = dynamic(() => import('@features/base/dashLayout'))

function Dashborad(){

    const { t, ready } = useTranslation('common');
    if (!ready) return (<>loading translations...</>);

    return(
        <main className={styles.main}>

        </main>
        )
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu']))
    }
})
export default Dashborad

Dashborad.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
