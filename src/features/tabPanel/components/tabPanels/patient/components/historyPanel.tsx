import {Box, Button, Stack, Typography, useTheme} from '@mui/material'
import {HistoryContainer, NoDataCard, PatientHistoryNoDataCard} from '@features/card'
import React, {useEffect, useState} from 'react'
import PanelStyled from './overrides/panelStyle'
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {Dialog} from "@features/dialog";
import {configSelector, dashLayoutSelector} from "@features/base";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {consultationSelector, SetSelectedDialog} from "@features/toolbar";
import {useRouter} from "next/router";
import {getPrescriptionUI} from "@lib/hooks/setPrescriptionUI";
import {useAppointmentHistory} from "@lib/hooks/rest";
import {useMedicalEntitySuffix} from "@lib/hooks";

function HistoryPanel({...props}) {
    const {
        patient,
        triggerPrevious,
        closePatientDialog
    } = props;

    const theme = useTheme();
    const dispatch = useAppDispatch();
    const {data: session} = useSession();
    const router = useRouter();
    const {
        previousAppointmentsData: previousAppointments,
        isLoading
    } = useAppointmentHistory({patientId: patient?.uuid});
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t} = useTranslation(["consultation", "patient"]);
    const {direction} = useAppSelector(configSelector);
    const {selectedDialog} = useAppSelector(consultationSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [dialog, setDialog] = useState<string>("");
    const [state, setState] = useState<any>();
    const [info, setInfo] = useState<null | string>("");
    const [dialogAction, setDialogAction] = useState<boolean>(false);
    const [apps, setApps] = useState(previousAppointments?.list);
    const [totalPagesLa, setTotalPagesLa] = useState(0);
    const [selectedAppointment, setSelectedAppointment] = useState<string>("");
    const [pagesLa, setPagesLa] = useState(1);

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInfo(null);
        setSelectedAppointment("");
        dispatch(SetSelectedDialog(null));
    }

    const showDoc = (card: any, app?: any) => {
        if (card.documentType === 'medical-certificate') {
            setInfo('document_detail');
            setState({
                uuid: card.uuid,
                content: card.certificate[0].content,
                certifUuid: card.certificate[0].uuid,
                doctor: card.name,
                patient: card.patient,
                description: card.description,
                days: card.days,
                createdAt: card.createdAt,
                name: 'certif',
                detectedType: card.type,
                type: 'write_certif'
            })
            setOpenDialog(true);
            setDialogAction(true);
        } else {
            setInfo('document_detail')
            let info = card
            let uuidDoc = "";
            switch (card.documentType) {
                case "prescription":
                    info = card.prescription[0].prescription_has_drugs;
                    uuidDoc = card.prescription[0].uuid
                    break;
                case "requested-analysis":
                    info = card.requested_Analyses[0].analyses;
                    uuidDoc = card.requested_Analyses[0].uuid;
                    break;
                case "requested-medical-imaging":
                    info = card.medical_imaging[0]['medical-imaging'];
                    uuidDoc = card.medical_imaging[0].uuid;
                    break;
            }
            setState({
                uuid: card.uuid,
                uri: card.uri,
                name: card.title,
                type: card.documentType,
                info: info,
                createdAt: card.createdAt,
                description: card.description,
                uuidDoc: uuidDoc,
                appUuid: app?.appointment.uuid,
                detectedType: card.type,
                patient: patient.firstName + ' ' + patient.lastName
            })
            setOpenDialog(true);
        }
    }

    useEffect(() => {
        if (selectedDialog && !router.asPath.includes('/dashboard/consultation/')) {
            switch (selectedDialog.action) {
                case "medical_prescription":
                case "medical_prescription_cycle":
                    //close document dialog
                    setOpenDialog(false);
                    break;
            }
        }
    }, [selectedDialog]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (previousAppointments && previousAppointments.list) {
            setApps([...previousAppointments.list]);
            setTotalPagesLa(previousAppointments.totalPages);
        }
    }, [previousAppointments, dispatch]);

    return (
        (apps && apps.length > 0) ?
            <PanelStyled>
                <Box className="files-panel">
                    <Typography fontWeight={600} p={1}>
                        {t("history")}
                    </Typography>
                    <Stack spacing={2} mt={0}>
                        {apps.map((app: any, appID: number) => (
                            <React.Fragment key={`app-el-${appID}`}>
                                <HistoryContainer {...{
                                    app,
                                    closePatientDialog,
                                    apps,
                                    setApps,
                                    appID,
                                    appuuid: '',
                                    dispatch,
                                    t,
                                    setInfo,
                                    setState,
                                    setOpenDialog,
                                    showDoc: ((data: any) => {
                                        setSelectedAppointment(app.appointment.uuid);
                                        showDoc(data, app);
                                    }),
                                    patient,
                                    session,
                                    medical_entity,
                                }}/>
                            </React.Fragment>))}
                    </Stack>
                    {totalPagesLa > pagesLa && <Button style={{width: "fit-content"}} size={"small"} onClick={() => {
                        if (medicalEntityHasUser) {
                            triggerPrevious({
                                method: "GET",
                                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient.uuid}/appointments/history/${router.locale}?page=${pagesLa + 1}&limit=5`
                            }).then((r: any) => {
                                const res = r?.data.data;
                                setApps([...apps, ...res.list])
                            })
                            setPagesLa(pagesLa + 1)
                        }
                    }}>{t('consultationIP.more')}</Button>}
                </Box>

                {info && (
                    <Dialog
                        {...{
                            direction,
                            sx: {
                                minHeight: 300
                            }
                        }}
                        action={info}
                        open={openDialog}
                        data={{
                            state,
                            setState,
                            setDialog,
                            setOpenDialog,
                            t
                        }}
                        size={"lg"}
                        color={
                            info === "secretary_consultation_alert" && theme.palette.error.main
                        }
                        {...(info === "document_detail" && {
                            sx: {p: 0},
                        })}
                        title={t(info === "document_detail" ? "doc_detail_title" : "")}
                        {...((info === "document_detail" || info === "end_consultation") && {
                            onClose: handleCloseDialog,
                        })}
                        dialogClose={handleCloseDialog}
                    />
                )}
            </PanelStyled>
            : isLoading ? <Stack spacing={2} padding={2}>
                    {Array.from({length: 3}).map((_, idx) => (
                        <React.Fragment key={`${idx}-empty-history`}>
                            <PatientHistoryNoDataCard/>
                        </React.Fragment>
                    ))}
                </Stack> :
                <NoDataCard
                    t={t}
                    ns={"patient"}
                    data={{
                        mainIcon: "consultation/ic-text",
                        title: "config.no-data.consultation.title",
                        description: "config.no-data.consultation.description"
                    }}
                />
    )
}

export default HistoryPanel
