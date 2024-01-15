import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {ReactElement} from "react";
import {DashLayout} from "@features/base";
import {Redirect} from "@features/redirect";
import {useSession} from "next-auth/react";

function Consultation() {
    const {data: session} = useSession();

    const features = session?.data?.medical_entities?.find((entity: MedicalEntityDefault) => entity.is_default)?.features;

    return (<Redirect to={features?.length > 0 ? `/dashboard/${features[0].slug}` : `/dashboard/agenda`}/>);
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
