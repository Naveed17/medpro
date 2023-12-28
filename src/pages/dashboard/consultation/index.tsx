import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {ReactElement} from "react";
import {DashLayout} from "@features/base";
import {Redirect} from "@features/redirect";

function Consultation() {
    return (<Redirect to='/dashboard/agenda'/>);
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ["consultation", "menu", "common"])),
    },
});
export default Consultation;

Consultation.auth = true;

Consultation.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
