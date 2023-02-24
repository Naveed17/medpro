import React, {useEffect, useState} from "react";
import {HistoryCard, HistoryContainer,} from "@features/card";
import {Label} from "@features/label";
import {Box, Button, Drawer, Stack, Typography,} from "@mui/material";
import {useAppSelector} from "@app/redux/hooks";
import {AppointmentDetail, DialogProps, openDrawer as DialogOpenDrawer,} from "@features/dialog";
import {SetSelectedApp} from "@features/toolbar";
import {useRequest} from "@app/axios";
import Icon from "@themes/urlIcon";
import Zoom from 'react-medium-image-zoom'
import moment from "moment/moment";

function HistoryTab({...props}) {

    const {
        patient,
        appointement,
        t,
        direction,
        setInfo,
        setState,
        appuuid,
        dispatch,
        setOpenDialog,
        medical_entity,
        showDoc,
        session,
        mutate,
        router
    } = props;

    const {drawer} = useAppSelector((state: { dialog: DialogProps }) => state.dialog);

    const [size, setSize] = useState<number>(3);
    const [apps, setApps] = useState<any>([]);
    const [photos, setPhotos] = useState<any[]>([]);

    const {data: httpPatientDocumentsResponse} = useRequest(patient ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/patients/${patient.uuid}/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`},
    } : null);

    useEffect(() => {
        setApps(appointement ? [...appointement.latestAppointments] : []);
        if (appointement?.latestAppointments.length > 0) {
            dispatch(SetSelectedApp(appointement.latestAppointments[0].appointment.uuid))
        }
    }, [appointement, appuuid, dispatch]);

    useEffect(() => {
        if (httpPatientDocumentsResponse) {
            setPhotos((httpPatientDocumentsResponse as HttpResponse).data.documents
                .filter((doc: { documentType: string; }) => doc.documentType === "photo"))
        }
    }, [httpPatientDocumentsResponse]);

    return (
        <>
            {patient?.nextAppointments.length > 0 && (
                <Stack spacing={2} mb={2} alignItems="flex-start">
                    <Label variant="filled" color="warning">
                        {t("next_meeting")}
                    </Label>
                    {patient?.nextAppointments
                        .slice(0, size)
                        .map((data: any, index: number) => (
                            <React.Fragment key={`patient-${index}`}>
                                <HistoryCard row={data} patient={patient} t={t}/>
                            </React.Fragment>
                        ))}
                </Stack>
            )}
            {size < patient?.nextAppointments.length && (
                <Button
                    style={{marginBottom: 10, marginTop: -10, fontSize: 12}}
                    onClick={() => {
                        setSize(patient?.nextAppointments.length);
                    }}>
                    {t("showAll")}
                </Button>
            )}

            {
                photos.length > 0 &&
                <Box>
                    <Label variant="filled" color="warning">
                        {t("consultationIP.suivi_image")}
                    </Label>
                    <Box style={{overflowX: "auto", marginBottom: 10}}>
                        <Stack direction={"row"} spacing={1} mt={2} mb={2} alignItems={"center"}>
                            {photos.map((photo, index) => (
                                <Box key={`photo${index}`} width={150} height={140} borderRadius={2}
                                     style={{background: "white"}}>
                                    <Zoom>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={photo.uri}
                                             alt={'img'}
                                             style={{borderRadius: "10px 10px 0 0", width: 150, height: 110}}
                                        />
                                    </Zoom>

                                    <Stack spacing={0.5} width={"fit-content"} margin={"auto"} direction="row"
                                           alignItems='center'>
                                        <Icon path="ic-agenda-jour"/>
                                        <Typography fontWeight={600} fontSize={13}>
                                            {moment(photo.createdAt, 'DD-MM-YYYY HH:mm').format('DD/MM/YYYY')}
                                        </Typography>
                                    </Stack>

                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Box>
            }
            <Stack spacing={2}>
                {apps.map((app: any, appID: number) => (
                    <React.Fragment key={`app-el-${appID}`}>
                        <HistoryContainer {...{
                            app,
                            apps,
                            setApps,
                            appID,
                            appuuid,
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
                    </React.Fragment>
                ))}
            </Stack>
            <Drawer
                anchor={"right"}
                open={drawer}
                dir={direction}
                onClose={() => {
                    dispatch(DialogOpenDrawer(false));
                }}>
                <AppointmentDetail/>
            </Drawer>
        </>
    );
}

export default HistoryTab;
