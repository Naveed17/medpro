import { Typography, Box, Stack, IconButton, Link, Button } from "@mui/material";
import NextLink from 'next/link'
import { Label } from "@features/label";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CipNextAppointCardStyled from './overrides/cipNextAppointCardStyle';
import Icon from "@themes/urlIcon";
// redux
import { useAppDispatch } from "@app/redux/hooks";
import { onOpenDetails } from "@features/table";
function CipMedicProCard({ ...props }) {
    const dispatch = useAppDispatch();
    const { row, t } = props
    return (
        <CipNextAppointCardStyled>
            <Stack spacing={4} direction="row" alignItems='center'>
                <Stack spacing={1} alignItems={'flex-start'}>
                    <Label variant='filled' color={row.status === "confirmed" ? "success" : 'primary'}>
                        {t("table." + row.status)}
                    </Label>
                    <Typography fontWeight={400}>
                        {t("table.reason_for_consultation")}
                    </Typography>
                    <Typography component={Stack} spacing={1} alignItems="center" direction="row">
                        <FiberManualRecordIcon fontSize="small" color={row.reson === "control" ? "success" : 'primary'} />
                        {t("table." + row.reson)}
                    </Typography>
                    <NextLink href="/">
                        <Link underline='none' sx={{ cursor: 'pointer' }}>
                            {t("table.send_the_link")}
                        </Link>
                    </NextLink>
                </Stack>
                <Box display={{ xs: 'none', md: 'block' }}>
                    <Typography fontWeight={400}>
                        {t("table.date_of_appointment")}
                    </Typography>
                    <Stack className='date-time' spacing={4} direction="row" alignItems='center'>
                        <Stack spacing={0.5} direction="row" alignItems='center'>
                            <Icon path="ic-agenda-jour" />
                            <Typography fontWeight={600}>
                                {row.length}
                            </Typography>
                        </Stack>
                        <Stack spacing={0.5} direction="row" alignItems='center'>
                            <Icon path="setting/ic-time" />
                            <Typography fontWeight={600} className="date">
                                {row.time}
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>
                <Stack spacing={2} direction="row" alignItems='center' ml={'auto !important'}>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(onOpenDetails({ patientId: row.id }));
                        }}
                        className="btn-more" size="small">{t('table.see_details')}</Button>
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(onOpenDetails({ patientId: row.id }));
                        }}
                        className="btn-more-mobile" size="small">
                        <Icon path='ic-edit-file' />
                    </IconButton>
                    <IconButton size="small">
                        <Icon path='ic-duotone' />
                    </IconButton>
                </Stack>
            </Stack>
        </CipNextAppointCardStyled>
    )
}
export default CipMedicProCard