import {GetStaticProps, NextPage} from 'next';
import {LoadingScreen} from "@features/loadingScreen";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

interface Props {
    statusCode?: number
}

const Custom404: NextPage<Props> = ({statusCode}) => {
    return (
        <LoadingScreen error button={'loading-error-404-reset'} text={"loading-error-404"}/>
    );
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu']))
    }
})
export default Custom404
