import {Box, Button, DialogActions, Stack, Typography, useTheme} from '@mui/material'
import {HistoryContainer} from '@features/card'
import React, {useEffect, useState} from 'react'
import PanelStyled from './overrides/panelStyle'
import IconUrl from '@themes/urlIcon'
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {Dialog} from "@features/dialog";
import {configSelector} from "@features/base";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CloseIcon from "@mui/icons-material/Close";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {consultationSelector} from "@features/toolbar";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import moment from "moment-timezone";
import {useRouter} from "next/router";
import {useRequestMutation} from "@app/axios";

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

    const {trigger: triggerUpdate} = useRequestMutation(null, "consultation/data/update");

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [actions, setActions] = useState<boolean>(false);
    const [dialog, setDialog] = useState<string>("");
    const [state, setState] = useState<any>();
    const [info, setInfo] = useState<null | string>("");
    const [dialogAction, setDialogAction] = useState<boolean>(false);
    const [apps, setApps] = useState<any>([]);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const DialogAction = () => {
        return (
            <DialogActions style={{justifyContent: 'space-between', width: '100%'}}>
                <Button
                    variant="text-black"
                    startIcon={<LogoutRoundedIcon/>}>
                    {t("withoutSave")}
                </Button>
                <Stack direction={"row"} spacing={2}>
                    <Button
                        variant="text-black"
                        startIcon={<CloseIcon/>}>
                        {t("cancel")}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<IconUrl path="ic-check"/>}>
                        {t("end_consultation")}
                    </Button>
                </Stack>
            </DialogActions>
        );
    };

    const showDoc = (card: any) => {
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
                detectedType: card.type,
                patient: patient.firstName + ' ' + patient.lastName,
                mutate
            })
            setOpenDialog(true);
        }
    }

    const handleSaveDialog = () => {
        const form = new FormData();

        switch (info) {
            case "medical_prescription_cycle":
                form.append("globalNote", "");
                form.append("isOtherProfessional", "false");
                form.append("drugs", JSON.stringify(state));

                triggerUpdate({
                    method: "PUT",
                    url: `/api/medical-entity/${medical_entity.uuid}/appointments/${"appuuid"}/prescriptions/${selectedDialog.uuid}/${router.locale}`,
                    data: form,
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`
                    },
                }).then((r: any) => {
                    mutatePatientHis();
                    mutate();
                    setInfo("document_detail");
                    const res = r.data.data;
                    let type = "";
                    if (!(res[0].patient?.birthdate && moment().diff(moment(res[0].patient?.birthdate, "DD-MM-YYYY"), 'years') < 18))
                        type = res[0].patient?.gender === "F" ? "Mme " : res[0].patient?.gender === "U" ? "" : "Mr "

                    setState({
                        uri: res[1],
                        name: "prescription",
                        type: "prescription",
                        info: res[0].prescription_has_drugs,
                        uuid: res[0].uuid,
                        uuidDoc: res[0].uuid,
                        createdAt: moment().format('DD/MM/YYYY'),
                        description: "",
                        patient: `${type} ${res[0].patient.firstName} ${res[0].patient.lastName}`
                    });
                    setOpenDialog(true);
                    setDialogAction(false);
                });
                break;
        }
    }

    useEffect(() => {
        setApps(previousAppointments ? [...previousAppointments] : []);
    }, [previousAppointments, dispatch]);

    useEffect(() => {
        if (selectedDialog) {
            switch (selectedDialog.action) {
                case "medical_prescription_cycle":
                    setInfo("medical_prescription_cycle");
                    setState(selectedDialog.state);
                    setOpenDialog(true);
                    break;
            }
        }
    }, [selectedDialog]);

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
                                showDoc,
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
                    title={t(info === "document_detail" ? "doc_detail_title" : info)}
                    {...((info === "document_detail" || info === "end_consultation") && {
                        onClose: handleCloseDialog,
                    })}
                    dialogClose={handleCloseDialog}
                    {...(actions && {
                        actionDialog: <DialogActions>
                            <Button
                                onClick={() => {
                                    setOpenDialog(false);
                                    setInfo(null);
                                }}
                                startIcon={<CloseIcon/>}>
                                {t("cancel")}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSaveDialog}
                                disabled={info === "medical_prescription_cycle" && state.length === 0}
                                startIcon={<SaveRoundedIcon/>}>
                                {t("save")}
                            </Button>
                        </DialogActions>,
                    })}
                />
            )}
        </PanelStyled>
    )
}

export default HistoryPanel
