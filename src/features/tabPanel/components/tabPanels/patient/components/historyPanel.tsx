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

function HistoryPanel({...props}) {
    const {previousAppointmentsData: previousAppointments, patient, mutate, closePatientDialog} = props;

    const {direction} = useAppSelector(configSelector);
    const {t} = useTranslation("consultation");
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const {data: session} = useSession();
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [actions, setActions] = useState<boolean>(false);
    const [dialog, setDialog] = useState<string>("");
    const [state, setState] = useState<any>();
    const [info, setInfo] = useState<null | string>("");
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
                mutate: mutate()
            })
            setOpenDialog(true);
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
                    break;
                case "requested-medical-imaging":
                    info = card.medical_imaging[0]['medical-imaging'];
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
                mutate: mutate()
            })
            setOpenDialog(true);
        }
    }

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
                        actionDialog: <DialogAction/>,
                    })}
                />
            )}
        </PanelStyled>
    )
}

export default HistoryPanel
