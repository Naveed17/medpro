// material
import {Typography, TableCell, Button, Box, Skeleton, Stack, IconButton} from "@mui/material";
// urils
import Icon from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
// style
import RootStyled from "./overrides/rootStyled";
import {ModelDot} from '@features/modelDot'
import {useRouter} from "next/router";
import {AppointmentStatus, IconsTypes, openDrawer, setSelectedEvent} from "@features/calendar";
import {useAppDispatch} from "@app/redux/hooks";
import moment from "moment/moment";
import {LoadingScreen} from "@features/loadingScreen";

function RdvCard({...props}) {
    const {inner, patient, loading} = props;
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {t, ready} = useTranslation("patient", {
        keyPrefix: "patient-details",
    });

    const onConsultationView = (appointmentUuid: string) => {
        const slugConsultation = `/dashboard/consultation/${appointmentUuid}`;
        router.push(slugConsultation, slugConsultation, {locale: router.locale});
    }

    const onAppointmentView = () => {
        const event: any = {
            title: `${patient.firstName}  ${patient.lastName}`,
            publicId: inner.uuid,
            extendedProps: {
                time: moment(`${inner.dayDate} ${inner.startTime}`, 'DD-MM-YYYY HH:mm').toDate(),
                patient: patient,
                motif: inner.consultationReason,
                instruction: inner.instruction,
                description: "",
                meeting: false,
                status: AppointmentStatus[inner.status]
            }
        }
        dispatch(setSelectedEvent(event));
        dispatch(openDrawer({type: "view", open: true}));
    }

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <RootStyled>
            <TableCell>
                <Box sx={{display: "flex"}}>
                    <Stack spacing={1}>
                        {inner.consultationReasons.length > 0 && <Stack spacing={1} alignItems={'flex-start'}>
                            <Typography fontWeight={400}>
                                {t("reason")}
                            </Typography>
                            <Typography component={Stack} spacing={1} alignItems="center" direction="row">
                                {inner.consultationReasons.map((reason: ConsultationReasonModel) => reason.name).join(", ")}
                            </Typography>
                        </Stack>}
                        {inner?.type && <Stack direction='row' alignItems="center">
                            <ModelDot
                                icon={IconsTypes[inner?.type.icon]}
                                color={inner?.type?.color}
                                selected={false} size={20} sizedot={12}
                                padding={3} marginRight={5}/>
                            <Typography variant="body2" color="text.primary">{inner?.type?.name}</Typography>
                        </Stack>}
                    </Stack>
                </Box>
            </TableCell>
            <TableCell>
                {loading ? (
                    <Skeleton variant="text" width={100}/>
                ) : (
                    <Stack spacing={1}>
                        <Typography variant="body2" color="text.primary">
                            {t('date')}
                        </Typography>
                        <Stack spacing={3} direction="row" alignItems='center'>
                            <Stack spacing={1} direction="row" alignItems='center' className="date-time">
                                <Icon path="ic-agenda"/>
                                <Typography fontWeight={700} variant="body2" color="text.primary">
                                    {inner?.dayDate}
                                </Typography>
                            </Stack>
                            <Stack spacing={1} direction="row" alignItems='center'>
                                <Icon path="ic-time"/>
                                <Typography fontWeight={700} variant="body2" color="text.primary">
                                    {inner?.startTime}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                )}
            </TableCell>

            <TableCell align="right" sx={{p: "0px 12px!important"}}>
                {!loading && inner.addRoom && (
                    <Button variant="text" color="primary" size="small" sx={{mr: 1}}>
                        {t("add-waiting-room")}
                    </Button>
                )}
                {loading ? (
                    <Skeleton variant="text" width={80} height={22} sx={{ml: "auto"}}/>
                ) : (
                    <Button
                        sx={{
                            display: router.asPath.includes("/dashboard/agenda") ? "none" : "inline-block"
                        }}
                        variant="text"
                        color="primary"
                        size="small"
                        onClick={() => inner?.status === 5 ? onConsultationView(inner?.uuid) : onAppointmentView()}>
                        {t(inner?.status === 5 ? "start-consultation" : "see-details")}
                    </Button>
                )}
            </TableCell>
        </RootStyled>
    );
}

export default RdvCard;
