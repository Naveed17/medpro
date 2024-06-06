import QuickAddAppointmentStyled from "./overrides/quickAddAppointmentStyled";
import { EventType, Patient, TimeSchedule, appointmentSelector } from "@features/tabPanel";
import { useRef, useState } from "react";
import { Button, CardHeader, Divider, IconButton, Stack, Theme, Typography, useTheme } from "@mui/material";
import { CustomIconButton } from "@features/buttons";
import IconUrl from "@themes/urlIcon";
import { Label } from "@features/label";
import { useAppSelector } from "@lib/redux/hooks";

function QuickAddAppointment({ ...props }) {
    const { handleAddPatient, t, withoutDateTime = false, handleClose } = props;
    const bottomRef = useRef(null);
    const theme = useTheme();
    const { finalize } = useAppSelector(appointmentSelector);
    return (
        <QuickAddAppointmentStyled>
            <CardHeader
                avatar={
                    <CustomIconButton disableRipple sx={{ bgcolor: (theme: Theme) => theme.palette.primary.lighter }}>
                        <IconUrl path="ic-filled-agenda" color={theme.palette.primary.main} width={32} height={32} />
                    </CustomIconButton>
                }
                title={<Typography variant="h6" lineHeight={1} fontSize={18}>{t('add')}</Typography>}
                subheader={<Typography fontWeight={500} color={theme.palette.grey[500]} variant="subtitle2">{t('add-new-rdv')}</Typography>}
                action={
                    <IconButton onClick={handleClose}>
                        <IconUrl path="ic-outline-close" width={16} height={16} />
                    </IconButton>
                }
            />
            <Divider />
            {finalize ?
                <Stack p={3}>
                    <Typography variant="subtitle2" fontSize={18} fontWeight={600}>{t('filter.appointment')}</Typography>
                    <TimeSchedule select {...{ withoutDateTime }} />
                    <Patient
                        select
                        {...{ handleAddPatient }}
                        onPatientSearch={() => {
                            setTimeout(() => {
                                (bottomRef.current as unknown as HTMLElement)?.scrollIntoView({ behavior: 'smooth' });
                            }, 300);
                        }} />
                    <div ref={bottomRef} />
                </Stack>
                : <Stack p={3} spacing={2} maxWidth={380} m="auto">
                    <Typography textAlign="center" variant="h5">{t('steppers.final-step.title')}</Typography>
                    <Typography lineHeight={2.5} textAlign='center' variant="subtitle2" color="grey.400" component="div">{t('steppers.final-step.rdv-for')} {" "}
                        <Label color="primary" sx={{ ml: 1 }}>
                            <Stack direction='row' component={'span'} alignItems='center' spacing={.5}>
                                <IconUrl color={theme.palette.primary.main} width={16} height={16} path="ic-filled-user-id" />
                                <Typography variant="caption" color='primary'>Patient s Name</Typography>
                            </Stack>
                        </Label>
                        <Typography component='div' variant="subtitle2">
                            {t("steppers.final-step.on")} {" "}
                            <Label color="success" sx={{ mx: 1 }}>
                                <Stack direction='row' component={'span'} alignItems='center' spacing={.5}>
                                    <IconUrl color={theme.palette.success.main} width={16} height={16} path="ic-filled-calendar-tick" />
                                    <Typography variant="caption" color='success.main'>Date</Typography>
                                </Stack>
                            </Label>
                            {t("steppers.final-step.at")} {" "}
                            <Label color="success" sx={{ mx: 1 }}>
                                <Stack direction='row' component={'span'} alignItems='center' spacing={.5}>
                                    <IconUrl color={theme.palette.success.main} width={16} height={16} path="ic-filled-clock" />
                                    <Typography variant="caption" color='success.main'>Time</Typography>
                                </Stack>
                            </Label> {" "}
                        </Typography>
                        <Typography variant="subtitle2" mt={1}>
                            {t("steppers.final-step.successfully-added")}
                        </Typography>
                    </Typography>
                    <Button startIcon={<IconUrl color={theme.palette.primary.main} width={16} height={16} path="ic-outline-user-id" />} variant="outlined">
                        {t("steppers.final-step.btn-view-rec")}
                    </Button>
                </Stack>
            }
        </QuickAddAppointmentStyled>
    )
}

export default QuickAddAppointment;
