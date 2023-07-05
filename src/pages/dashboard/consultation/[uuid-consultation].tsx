import React, {ReactElement, useEffect, useState} from "react";
import {GetStaticPaths, GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {pdfjs} from "react-pdf";
import {DashLayout, dashLayoutSelector} from "@features/base";
import {useTheme} from "@mui/material";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {useSession} from "next-auth/react";
import {useMedicalEntitySuffix, useMedicalProfessionalSuffix} from "@lib/hooks";
import {useTranslation} from "next-i18next";
import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import {useWidgetModels} from "@lib/hooks/rest";
import {agendaSelector} from "@features/calendar";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function ConsultationInProgress() {

    const theme = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {t, ready} = useTranslation("consultation");
    const {config: agenda, openAddDrawer, currentStepper} = useAppSelector(agendaSelector);

    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const {models, modelsMutate} = useWidgetModels({filter: ""})
    const {
        mutate: mutateOnGoing,
        medicalEntityHasUser,
        medicalProfessionalData
    } = useAppSelector(dashLayoutSelector);

    const medical_professional_uuid = medicalProfessionalData && medicalProfessionalData[0].medical_professional.uuid;

    /* useLeavePageConfirm(() => {
         // mutateSheetData().then(() => setLoading(true));
         modelsMutate().then((r) => {console.log(r)});
      });
 */
    const {data: user} = session as Session;

    const app_uuid = router.query["uuid-consultation"];
    const medical_entity = (user as UserDataResponse)?.medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    const [secretary, setSecretary] = useState("");
    const [previousData, setPreviousData] = useState(null);
    const [appointment, setAppointment] = useState<AppointmentDataModel>();

    const {data: httpUsersResponse} = useRequest(medical_entity ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/users`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    const {data: httpPreviousResponse} = useRequest(medical_entity && agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/previous/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);

    const {data: httpAppResponse, mutate} = useRequest(medical_professional_uuid && agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/professionals/${medical_professional_uuid}/${router.locale}`,
        headers: {
            ContentType: "multipart/form-data",
            Authorization: `Bearer ${session?.accessToken}`,
        },
    } : null, SWRNoValidateConfig);

    const {data: httpSheetResponse, mutate: mutateSheetData} = useRequest(agenda && medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/agendas/${agenda?.uuid}/appointments/${app_uuid}/consultation-sheet/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`,},
    } : null);

    const {data: httpDocumentResponse, mutate: mutateDoc} = useRequest(medical_professional_uuid && agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/documents/${router.locale}`,
        headers: {
            ContentType: "multipart/form-data",
            Authorization: `Bearer ${session?.accessToken}`,
        },
    } : null, SWRNoValidateConfig);

    useEffect(() => {
        if (httpUsersResponse && (httpUsersResponse as HttpResponse).data.length > 0)
            setSecretary((httpUsersResponse as HttpResponse).data[0]?.uuid);
    }, [httpUsersResponse]);

    useEffect(() => {
        if (httpPreviousResponse) {
            const data = (httpPreviousResponse as HttpResponse).data;
            if (data)
                setPreviousData(data);
        }
    }, [httpPreviousResponse]);

    useEffect(() => {
        if (httpAppResponse)
            setAppointment((httpAppResponse as HttpResponse)?.data);
    }, [httpAppResponse]);


    return (
        <>

        </>
    );
}

export const getStaticProps: GetStaticProps = async ({locale}) => {
    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(locale as string, [
                "consultation",
                "menu",
                "common",
                "agenda",
                "patient",
            ])),
        },
    };
};
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};
export default ConsultationInProgress;

ConsultationInProgress.auth = true;

ConsultationInProgress.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
