import { Typography, Box, Stack, IconButton, Button } from "@mui/material";
import Icon from "@themes/urlIcon";
import { useTranslation } from "next-i18next";
import { ModelDot } from "@features/modelDot";
import HistoryCardStyled from "./overrides/historyCardStyle";
export default function HistoryCard() {
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" });
    if (!ready) return <>loading translations...</>;
    return (
        <HistoryCardStyled>
            <Stack spacing={4} direction="row" alignItems='center'>
                <Stack spacing={1} alignItems={'flex-start'}>
                    <Typography fontWeight={400}>
                        {t("reason_for_consultation")}
                    </Typography>
                    <Typography component={Stack} spacing={1} alignItems="center" direction="row">
                        <ModelDot color={'#0696D6'} selected={false} size={21} sizedot={13}
                            padding={3} marginRight={5} />
                        {t("check")}
                    </Typography>
                </Stack>
                <Box display={{ xs: 'none', md: 'block' }}>
                    <Typography fontWeight={400}>
                        {t("appointment_date")}
                    </Typography>
                    <Stack className='date-time' spacing={4} direction="row" alignItems='center'>
                        <Stack spacing={0.5} direction="row" alignItems='center'>
                            <Icon path="ic-agenda-jour" />
                            <Typography fontWeight={600}>
                                30/07/2022
                            </Typography>
                        </Stack>
                        <Stack spacing={0.5} direction="row" alignItems='center'>
                            <Icon path="setting/ic-time" />
                            <Typography fontWeight={600} className="date">
                                14:30
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>
                <Stack spacing={2} direction="row" alignItems='center' ml={'auto !important'}>
                    <Button className="btn-more" size="small">{t('see_details')}</Button>
                    <IconButton
                        className="btn-more-mobile" size="small">
                        <Icon path='ic-edit-file' />
                    </IconButton>
                    <IconButton size="small">
                        <Icon path='ic-duotone' />
                    </IconButton>
                </Stack>
            </Stack>
        </HistoryCardStyled>
    )
}
