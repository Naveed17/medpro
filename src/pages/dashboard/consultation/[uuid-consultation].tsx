import React, {ReactElement} from "react";
import {GetStaticPaths, GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {configSelector, DashLayout, dashLayoutSelector} from "@features/base";
import {Dialog, DialogProps, PatientDetail} from "@features/dialog";
import useUsersList from "@lib/hooks/rest/useUsersList";
import {Button, useTheme} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {timerSelector} from "@features/card";
import {consultationSelector} from "@features/toolbar";
import {appLockSelector} from "@features/appLock";
import {tableActionSelector} from "@features/table";
import {cashBoxSelector} from "@features/leftActionBar";
import {agendaSelector} from "@features/calendar";
import {useTranslation} from "next-i18next";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useWidgetModels} from "@lib/hooks/rest";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

function ConsultationInProgress() {

    const theme = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {models, modelsMutate} = useWidgetModels({filter: ""})

    const {t, ready} = useTranslation("consultation");
    const {config: agenda, openAddDrawer, currentStepper} = useAppSelector(agendaSelector);
    const {selectedBoxes} = useAppSelector(cashBoxSelector);


    //***** SELECTORS ****//
    const {
        mutate: mutateOnGoing,
        medicalEntityHasUser,
        medicalProfessionalData
    } = useAppSelector(dashLayoutSelector);
    const {isActive, event} = useAppSelector(timerSelector);
    const {selectedDialog, exam} = useAppSelector(consultationSelector);
    const {direction} = useAppSelector(configSelector);
    const {lock} = useAppSelector(appLockSelector);
    const {tableState} = useAppSelector(tableActionSelector);
    const {drawer} = useAppSelector((state: { dialog: DialogProps }) => state.dialog);

    const {users} = useUsersList();

    return (
        <>
            <Button onClick={()=>{console.log(users)}}>OK</Button>
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
                "payment",
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
