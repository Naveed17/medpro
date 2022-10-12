// material
import {Typography, TableCell, Button, Box, Skeleton} from "@mui/material";

// urils
import Icon from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
// style
import RootStyled from "./overrides/rootStyled";
import {useRouter} from "next/router";
import {AppointmentStatus, openDrawer, setSelectedEvent} from "@features/calendar";
import {useAppDispatch} from "@app/redux/hooks";
import moment from "moment/moment";

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
            title: `${patient.lastName}  ${patient.firstName}`,
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

    if (!ready) return <>loading translations...</>;
    return (
        <RootStyled>
            <TableCell
                className="first-child"
                sx={{
                    "&:after": {
                        bgcolor: loading ? "green" : inner.consultationReason?.color,
                    },
                }}
            >
                <Box sx={{display: "flex"}}>
                    <Icon path="ic-agenda"/>
                    <Typography variant="body2" color="text.secondary" sx={{mr: 3}}>
                        {loading ? <Skeleton variant="text" width={100}/> : inner.dayDate}
                    </Typography>
                    <Icon path="ic-time"/>
                    <Typography variant="body2" color="text.secondary">
                        {loading ? (
                            <Skeleton variant="text" width={100}/>
                        ) : (
                            inner.startTime
                        )}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell className="cell-motif"
                       sx={{
                           minHeight: 38
                       }}>
                {loading ? (
                    <Skeleton variant="text" width={100}/>
                ) : (
                    <>
                        {inner.meeting && <Icon path="ic-video"/>}

                        {inner.consultationReason && <Typography variant="body2" color="primary.main">
                            {" "}
                            {inner.consultationReason?.name}
                        </Typography>}
                    </>
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
                    <Button variant="text"
                            onClick={() => inner?.status === 5 ? onConsultationView(inner?.uuid) : onAppointmentView()}
                            color="primary" size="small">
                        {t("see-details")}
                    </Button>
                )}
            </TableCell>
        </RootStyled>
    );
}

export default RdvCard;
