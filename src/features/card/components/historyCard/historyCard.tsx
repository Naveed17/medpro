import {Typography, Box, Stack, IconButton, Button} from "@mui/material";
import Icon from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import {ModelDot} from "@features/modelDot";
import HistoryCardStyled from "./overrides/historyCardStyle";
import moment from "moment/moment";
import {AppointmentStatus, setSelectedEvent} from "@features/calendar";
import {openDrawer} from "@features/dialog";
import {useAppDispatch} from "@app/redux/hooks";

export default function HistoryCard({...props}) {

    const {row, patient} = props
    const dispatch = useAppDispatch();
    const status = AppointmentStatus[row.status];

    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"});
    if (!ready) return <>loading translations...</>;
    return (
        <HistoryCardStyled>
            <Stack spacing={4} direction="row" alignItems='center'>
                <Stack spacing={1} alignItems={'flex-start'}>
                    <Typography fontWeight={400}>
                        {t("reason_for_consultation")}
                    </Typography>
                    <Typography component={Stack} spacing={1} alignItems="center" direction="row">
                        <ModelDot color={row.consultationReason.color} selected={false} size={21} sizedot={13}
                                  padding={3} marginRight={5}/>
                        {row.consultationReason.name}
                    </Typography>
                </Stack>
                <Box display={{xs: 'none', md: 'block'}}>
                    <Typography fontWeight={400}>
                        {t("appointment_date")}
                    </Typography>
                    <Stack className='date-time' spacing={4} direction="row" alignItems='center'>
                        <Stack spacing={0.5} direction="row" alignItems='center'>
                            <Icon path="ic-agenda-jour"/>
                            <Typography fontWeight={600}>
                                {row.dayDate}
                            </Typography>
                        </Stack>
                        <Stack spacing={0.5} direction="row" alignItems='center'>
                            <Icon path="setting/ic-time"/>
                            <Typography fontWeight={600} className="date">
                                {row.startTime}
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>
                <Stack spacing={2} direction="row" alignItems='center' ml={'auto !important'}>
                    <Button className="btn-more" onClick={() => {
                        const event = {
                            title: `${patient.lastName}  ${patient.firstName}`,
                            publicId: row.uuid,
                            extendedProps: {
                                time: moment(`${row.dayDate} ${row.startTime}`, 'DD-MM-YYYY HH:mm').toDate(),
                                patient: patient,
                                motif: row.consultationReason,
                                description: "",
                                meeting: false,
                                status: status.value
                            }
                        }
                        dispatch(setSelectedEvent(event as any));
                        dispatch(openDrawer(true));
                    }} size="small">{t('see_details')}</Button>
                    <IconButton
                        onClick={()=>{dispatch(openDrawer(true));}}
                        className="btn-more-mobile" size="small">
                        <Icon path='ic-edit-file'/>
                    </IconButton>
                    <IconButton size="small">
                        <Icon path='ic-duotone'/>
                    </IconButton>
                </Stack>
            </Stack>
        </HistoryCardStyled>
    )
}
