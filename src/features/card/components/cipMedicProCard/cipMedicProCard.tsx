import { Typography, Box, Stack, IconButton, Link, Button } from "@mui/material";
import NextLink from 'next/link'
import { Label } from "@features/label";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CipMedicProCardStyled from './overrides/cipMedicProCardStyle';
import Icon from "@themes/urlIcon";
function CipMedicProCard({ ...props }) {
    const { row, t } = props
    return (
        <CipMedicProCardStyled>
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
                    <Button className="btn-more" size="small">{t('table.see_details')}</Button>
                    <IconButton className="btn-more-mobile" size="small">
                        <Icon path='ic-edit-file' />
                    </IconButton>
                    <IconButton size="small">
                        <Icon path='ic-duotone' />
                    </IconButton>
                </Stack>
            </Stack>
        </CipMedicProCardStyled>
    )
}
export default CipMedicProCard