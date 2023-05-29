import {Box, Button, DialogActions, Stack, Typography, useTheme} from '@mui/material'
import {HistoryContainer} from '@features/card'
import React, {useEffect, useState} from 'react'
import PanelStyled from './overrides/panelStyle'
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {Dialog} from "@features/dialog";
import {configSelector} from "@features/base";
import CloseIcon from "@mui/icons-material/Close";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {consultationSelector, SetSelectedDialog} from "@features/toolbar";
import {useRouter} from "next/router";
import {useRequestMutation} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {setPrescriptionUI} from "@lib/hooks/setPrescriptionUI";

function HistoryPanel({...props}) {
    const {
        previousAppointmentsData: previousAppointments,
        patient,
        mutate,
        mutatePatientHis,
        closePatientDialog
    } = props;

    const theme = useTheme();
    const dispatch = useAppDispatch();
    const {data: session} = useSession();
    const router = useRouter();

    const {direction} = useAppSelector(configSelector);
    const {selectedDialog} = useAppSelector(consultationSelector);
    const {t} = useTranslation("consultation");

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [dialog, setDialog] = useState<string>("");
    const [state, setState] = useState<any>();
    const [info, setInfo] = useState<null | string>("");
    const [dialogAction, setDialogAction] = useState<boolean>(false);
    const [apps, setApps] = useState<any>([]);
    const [selectedAppointment, setSelectedAppointment] = useState<string>("");

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
                type: 'write_certif',
                mutate
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
                patient: patient.firstName + ' ' + patient.lastName,
                mutate
            })
            setOpenDialog(true);
        }
    }

    const handleSwitchUI = () => {
        //close the current dialog
        setOpenDialog(false);
        setInfo(null);
        // switch UI and open dialog
        setInfo(setPrescriptionUI());
        setOpenDialog(true);
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
        setApps(previousAppointments ? [...previousAppointments] : []);
    }, [previousAppointments, dispatch]);

    return (
        <PanelStyled>
            <Box className="files-panel">
                <Typography fontWeight={600} p={1}>
                    {t("history")}
                </Typography>
                <Stack spacing={2}>
                    {apps && apps.map((app: any, appID: number) => (
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
                                mutate,
                                patient,
                                session,
                                medical_entity,
                            }}/>
                        </React.Fragment>))}
                </Stack>
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
    )
}

export default HistoryPanel
