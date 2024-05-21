import QuickAddAppointmentStyled from "./overrides/quickAddAppointmentStyled";
import { EventType, Patient, TimeSchedule } from "@features/tabPanel";
import { useRef } from "react";
import { CardHeader, Divider, IconButton, Stack, Theme, Typography, useTheme } from "@mui/material";
import { CustomIconButton } from "@features/buttons";
import IconUrl from "@themes/urlIcon";

function QuickAddAppointment({ ...props }) {
    const { handleAddPatient, t, withoutDateTime = false } = props;
    const bottomRef = useRef(null);
    const theme = useTheme()

    return (
        <QuickAddAppointmentStyled>
            <CardHeader
                avatar={
                    <CustomIconButton disableRipple sx={{ bgcolor: (theme: Theme) => theme.palette.primary.lighter }}>
                        <IconUrl path="ic-filled-agenda" color={theme.palette.primary.main} width={32} height={32} />
                    </CustomIconButton>
                }
                title={<Typography variant="h6" fontSize={18}>{t('add')}</Typography>}
                subheader={<Typography fontWeight={500} color={theme.palette.grey[500]} variant="subtitle2">{t('add-new-rdv')}</Typography>}
                action={
                    <IconButton>
                        <IconUrl path="ic-outline-close" width={16} height={16} />
                    </IconButton>
                }
            />
            <Divider sx={{ mb: 2, mx: -3 }} />
            <Stack>
                <Typography variant="subtitle2" fontSize={18} fontWeight={600}>{t('filter.appointment')}</Typography>
                <TimeSchedule select {...{ withoutDateTime }} />
            </Stack>

            <Patient
                select
                {...{ handleAddPatient }}
                onPatientSearch={() => {
                    setTimeout(() => {
                        (bottomRef.current as unknown as HTMLElement)?.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                }} />
            <div ref={bottomRef} />
        </QuickAddAppointmentStyled>
    )
}

export default QuickAddAppointment;
