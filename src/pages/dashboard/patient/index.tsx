// react
import React, {useEffect, useState, ReactElement} from "react";

// next
import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";

import {Session} from "next-auth";

// material components
import {Box, Drawer, Zoom} from "@mui/material";

// redux
import {useAppSelector, useAppDispatch} from "@app/redux/hooks";
import {tableActionSelector} from "@features/table";
import {configSelector} from "@features/base";
import {onOpenPatientDrawer} from "@features/table";

// ________________________________
import {PatientMobileCard} from "@features/card";
import {Otable} from "@features/table";
import {SubHeader} from "@features/subHeader";
import {PatientToolbar} from "@features/toolbar";
import {DashLayout} from "@features/base";
import {CustomStepper} from "@features/customStepper";
import {useRequest} from "@app/axios";

import {
    AddPatientStep1,
    AddPatientStep2,
    AddPatientStep3, onResetPatient, setAppointmentPatient,
} from "@features/tabPanel";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {AppointmentDetail, PatientDetail} from "@features/dialog";
import {leftActionBarSelector} from "@features/leftActionBar";
import {prepareSearchKeys, useIsMountedRef} from "@app/hooks";
import {agendaSelector, openDrawer} from "@features/calendar";
import {toggleSideBar} from "@features/sideBarMenu";
import {appLockSelector} from "@features/appLock";

const stepperData = [
    {
        title: "tabs.personal-info",
        children: AddPatientStep1,
        disabled: false,
    },
    {
        title: "tabs.additional-information",
        children: AddPatientStep2,
        disabled: true,
    },
    {
        title: "tabs.fin",
        children: AddPatientStep3,
        disabled: true,
    },
];

// interface
interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
    align: "left" | "right" | "center";
}

// table head data
const headCells: readonly HeadCell[] = [
    {
        id: "select-all",
        numeric: false,
        disablePadding: true,
        label: "checkbox",
        sortable: false,
        align: "left",
    },
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "name",
        sortable: true,
        align: "left",
    },
    {
        id: "telephone",
        numeric: true,
        disablePadding: false,
        label: "telephone",
        sortable: true,
        align: "left",
    },
    /*{
        id: "city",
        numeric: false,
        disablePadding: false,
        label: "city",
        sortable: true,
        align: "left",
    },*/
    {
        id: "nextAppointment",
        numeric: false,
        disablePadding: false,
        label: "nextAppointment",
        sortable: false,
        align: "left",
    },
    {
        id: "lastAppointment",
        numeric: false,
        disablePadding: false,
        label: "lastAppointment",
        sortable: false,
        align: "left",
    },
    {
        id: "action",
        numeric: false,
        disablePadding: false,
        label: "action",
        sortable: false,
        align: "right",
    },
];

function Patient() {
    const dispatch = useAppDispatch();
    const {data: session} = useSession();
    const router = useRouter();
    const isMounted = useIsMountedRef();
    // selectors
    const {query: filter} = useAppSelector(leftActionBarSelector);
    const {t, ready} = useTranslation("patient", {keyPrefix: "config"});
    const {patientId, patientAction} = useAppSelector(tableActionSelector);
    const {direction} = useAppSelector(configSelector);
    const {openViewDrawer} = useAppSelector(agendaSelector);
    const {lock} = useAppSelector(appLockSelector);
    // state hook for details drawer
    const [patientDetailDrawer, setPatientDetailDrawer] = useState<boolean>(false);
    const [appointmentDetailDrawer, setAppointmentDetailDrawer] = useState<boolean>(false);
    const [patientDrawer, setPatientDrawer] = useState<boolean>(false);
    const [isAddAppointment, setAddAppointment] = useState<boolean>(false);
    const [selectedPatient, setSelectedPatient] = useState<PatientModel | null>(null);
    const [localFilter, setLocalFilter] = useState("");

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpPatientsResponse, mutate} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/patients/${router.locale}?page=${router.query.page || 1}&limit=10&withPagination=true${localFilter}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    }, SWRNoValidateConfig);


    useEffect(() => {
        if (filter?.type || filter?.patient) {
            const query = prepareSearchKeys(filter as any);
            setLocalFilter(query);
        }
    }, [filter]);

    useEffect(() => {
        if (isMounted.current && !lock) {
            dispatch(toggleSideBar(false));
        }
    }, [dispatch, isMounted]); // eslint-disable-line react-hooks/exhaustive-deps

    const submitStepper = (index: number) => {
        if (index === 2) {
            dispatch(onResetPatient())
            mutate();
        }
    }

    const handleTableActions = (action: string, event: PatientModel) => {
        switch (action) {
            case "PATIENT_DETAILS":
                setAddAppointment(false);
                setPatientDetailDrawer(true);
                break;
            case "EDIT_PATIENT":
                setSelectedPatient(event);
                setPatientDrawer(true);
                break;
            case "ADD_APPOINTMENT":
                dispatch(setAppointmentPatient(event as any));
                setAddAppointment(true);
                setSelectedPatient(event);
                setPatientDetailDrawer(true);
                break;
        }
    }

    if (!ready) return <>loading translations...</>;

    return (
        <>
            <SubHeader>
                <PatientToolbar
                    onAddPatient={() => {
                        setSelectedPatient(null);
                        setPatientDrawer(true);
                    }}
                />
            </SubHeader>
            <Box className="container">
                <Box display={{xs: "none", md: "block"}}>
                    <Otable
                        headers={headCells}
                        handleEvent={handleTableActions}
                        rows={(httpPatientsResponse as HttpResponse)?.data?.list}
                        from={"patient"}
                        t={t}
                        pagination
                        total={(httpPatientsResponse as HttpResponse)?.data?.total}
                        totalPages={
                            (httpPatientsResponse as HttpResponse)?.data?.totalPages
                        }
                        loading={!Boolean(httpPatientsResponse)}
                    />
                </Box>
                <PatientMobileCard
                    ready={ready}
                    PatiendData={(httpPatientsResponse as HttpResponse)?.data?.list}
                />
            </Box>

            <Drawer
                anchor={"right"}
                open={openViewDrawer}
                dir={direction}
                onClose={() => {
                    dispatch(openDrawer({type: "view", open: false}));
                }}
            >
                <AppointmentDetail
                    OnDataUpdated={() => mutate()}
                />
            </Drawer>

            <Drawer
                anchor={"right"}
                open={patientDetailDrawer}
                dir={direction}
                onClose={() => {
                    dispatch(onOpenPatientDrawer({patientId: ""}));
                    setPatientDetailDrawer(false);
                }}
            >
                <PatientDetail
                    {...{isAddAppointment, mutate}}
                    onCloseDialog={() => {
                        dispatch(onOpenPatientDrawer({patientId: ""}));
                        setPatientDetailDrawer(false);
                    }}
                    onAddAppointment={() => console.log("onAddAppointment")}
                    patientId={patientId}
                />
            </Drawer>

            <Drawer
                anchor={"right"}
                open={patientDrawer}
                dir={direction}
                onClose={() => {
                    setPatientDrawer(false);
                    dispatch(
                        onOpenPatientDrawer({
                            patientId: "",
                            patientAction: "",
                        })
                    );
                }}
                sx={{
                    "& .MuiTabs-root": {
                        position: "sticky",
                        top: 0,
                        bgcolor: (theme) => theme.palette.background.paper,
                        zIndex: 11,
                    },
                }}
            >
                <CustomStepper
                    translationKey="patient"
                    prefixKey="add-patient"
                    stepperData={stepperData}
                    OnSubmitStepper={submitStepper}
                    scroll
                    t={t}
                    minWidth={648}
                    selectedPatient={selectedPatient}
                    onClose={() => {
                        setPatientDrawer(false);
                    }}
                />
            </Drawer>
        </>
    );
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, [
            "patient",
            "agenda",
            "consultation",
            "menu",
            "common",
        ])),
    },
});

export default Patient;

Patient.auth = true;

Patient.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
