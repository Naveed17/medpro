import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {ReactElement} from "react";
import dynamic from "next/dynamic";
import {useRouter} from "next/router";
const DashLayout = dynamic(() => import('@features/base/dashLayout'))

function Dashborad(){
    const router = useRouter();
    const { t, ready } = useTranslation('common');
    if (!ready) return (<>loading translations...</>);

    return(
        <div>Hello from {router.pathname.slice(1)}</div>
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
