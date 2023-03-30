import {Typography, Box, Stack, IconButton, Link, Button} from "@mui/material";
import NextLink from 'next/link'
import {Label} from "@features/label";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CipNextAppointCardStyled from './overrides/cipNextAppointCardStyle';
import Icon from "@themes/urlIcon";
// redux
import {useAppDispatch} from "@app/redux/hooks";
import {openDrawer,} from "@features/dialog";
import {ModelDot} from "@features/modelDot";
import {AppointmentStatus, setSelectedEvent} from "@features/calendar";
import moment from "moment";

function CipMedicProCard({...props}) {
    const dispatch = useAppDispatch();
    const {row, patient, t} = props
    const status = AppointmentStatus[row.status];

    return (
        <CipNextAppointCardStyled>
            <Stack spacing={4} direction="row" alignItems='center'>
                <Stack spacing={1} alignItems={'flex-start'}>
                    <Label variant='filled' sx={{backgroundColor: status.color, color: "#fff"}}>
                        {status.value}
                    </Label>
                    <Typography fontWeight={400}>
                        {t("table.reason_for_consultation")}
                    </Typography>
                    {row.consultationReasons.length > 0 &&
                        <Typography component={Stack} spacing={1} alignItems="center" direction="row">
                            {row.consultationReasons.map((reason: ConsultationReasonModel) => reason.name).join(", ")}
                        </Typography>}
                    <NextLink href="/">
                        <Link underline='none' sx={{cursor: 'pointer'}}>
                            {t("table.send_the_link")}
                        </Link>
                    </NextLink>
                </Stack>
                <Box display={{xs: 'none', md: 'block'}}>
                    <Typography fontWeight={400}>
                        {t("table.date_of_appointment")}
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
                {patient && <Stack spacing={2} direction="row" alignItems='center' ml={'auto !important'}>
                    <Button
                        onClick={(e) => {
                            const event = {
                                title: `${patient.firstName}  ${patient.lastName}`,
                                publicId: row.uuid,
                                extendedProps: {
                                    time: moment(`${row.dayDate} ${row.startTime}`, 'DD-MM-YYYY HH:mm').toDate(),
                                    patient: patient,
                                    motif: row.consultationReasons,
                                    description: "",
                                    meeting: false,
                                    status: status.value
                                }
                            }
                            dispatch(setSelectedEvent(event as any));
                            dispatch(openDrawer(true));
                        }}
                        className="btn-more" size="small">{t('table.see_details')}</Button>
                    <IconButton
                        onClick={(e) => {
                            dispatch(openDrawer(true));
                        }}
                        className="btn-more-mobile" size="small">
                        <Icon path='ic-edit-file'/>
                    </IconButton>
                    <IconButton size="small">
                        <Icon path='ic-duotone'/>
                    </IconButton>
                </Stack>}
            </Stack>
        </CipNextAppointCardStyled>
    )
}

export default CipMedicProCard
