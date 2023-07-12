import React, {useEffect, useState} from "react";
import {HistoryCard, HistoryContainer,} from "@features/card";
import {Label} from "@features/label";
import {Box, Button, Drawer, Stack, Typography,} from "@mui/material";
import {useAppSelector} from "@lib/redux/hooks";
import {AppointmentDetail, dialogSelector, openDrawer as DialogOpenDrawer,} from "@features/dialog";
import {SetSelectedApp} from "@features/toolbar";
import {useRequest} from "@lib/axios";
import Icon from "@themes/urlIcon";
import Zoom from 'react-medium-image-zoom'
import moment from "moment/moment";
import HistoryStyled
    from "@features/tabPanel/components/consultationTabs/historyTab/components/overrides/historyStyled";
import {dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix} from "@lib/hooks";

function HistoryTab({...props}) {

    const {
        patient,
        appointment,
        t,
        direction,
        setInfo,
        setState,
        appuuid,
        dispatch,
        setOpenDialog,
        medical_entity,
        showDoc,
        setSelectedTab,
        session,
        mutate,
        dates, keys, modelData,
        router
    } = props;
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {drawer} = useAppSelector(dialogSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [size, setSize] = useState<number>(3);
    const [apps, setApps] = useState<any>([]);
    const [photos, setPhotos] = useState<any[]>([]);

    const {data: httpPatientDocumentsResponse} = useRequest(medicalEntityHasUser && patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient.uuid}/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`},
    } : null);

    useEffect(() => {
        setApps(appointment ? [...appointment.latestAppointments] : []);
        if (appointment?.latestAppointments.length > 0) {
            dispatch(SetSelectedApp(appointment.latestAppointments[0].appointment.uuid))
        }
    }, [appointment, appuuid, dispatch]);

    useEffect(() => {
        if (httpPatientDocumentsResponse) {
            setPhotos((httpPatientDocumentsResponse as HttpResponse).data.documents.reverse()
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
                                        <img
                                            src={photo.uri.thumbnails.length === 0 ? photo.uri.url : photo.uri.thumbnails['thumbnail_128']}
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

            {Object.keys(modelData).length > 0 && <Stack spacing={2} mb={2} alignItems="flex-start">
                <Label variant="filled" color="warning">
                    {t("history")}
                </Label>
            </Stack>}

            <div style={{overflowY: "hidden"}}>
                {Object.keys(modelData).length > 0 &&
                    <HistoryStyled>
                        <thead>
                        <tr>
                            <td className={'col'}></td>
                            {dates.map((date: string) => (<td key={date} className={'col'}><Typography
                                className={"header"}>{date}</Typography></td>))}
                        </tr>
                        </thead>
                        <tbody>
                        {keys.map((key: string) => (
                            <tr key={key}>
                                <td style={{minWidth: 120}}><Typography
                                    className={"keys col"}>{modelData[key]['label']}</Typography></td>
                                {dates.map((date: string) => (<td key={date}><Typography
                                    className={"data col"}>{modelData[key]['data'][date] ? modelData[key]['data'][date] + modelData[key]['description'] : '-'}</Typography>
                                </td>))}
                            </tr>
                        ))}
                        </tbody>
                    </HistoryStyled>}
            </div>

            <Stack spacing={1}>
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
                            setSelectedTab,
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
                <AppointmentDetail from="HistoryTab"/>
            </Drawer>
        </>
    );
}

export default HistoryTab;
