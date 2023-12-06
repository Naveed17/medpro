import ConsultationPopupActionStyled from "./overrides/consultationPopupActionStyled";
import {
    Card,
    CardContent,
    List,
    ListItem,
    Typography,
    Stack,
    Avatar,
    Box,
    Button
} from '@mui/material'
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import * as React from "react";
import {useTranslation} from "next-i18next";


import {LoadingScreen} from "@features/loadingScreen";

import {useState} from "react";
import {useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";
import {LoadingButton} from "@mui/lab";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import CheckIcon from "@mui/icons-material/Check";
import IconUrl from "@themes/urlIcon";

function ConsultationPopupAction({...props}) {
    const {data, OnSchedule, OnPay, devise} = props
    const {data: session} = useSession();

    const {t, ready} = useTranslation("common");
    const {config: agenda, selectedEvent: appointment} = useAppSelector(agendaSelector);

    const {data: user} = session as Session;
    const isBeta = localStorage.getItem('newCashbox') ? localStorage.getItem('newCashbox') === '1' : user.medical_entity.hasDemo;

    const [instruction] = useState(`${data.control ? `${t("next-appointment-control")} ${data.nextAppointment}  \r\n` : ""}, ${data.instruction}`);
    const [loadingRequest, setLoadingRequest] = useState(false);

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <ConsultationPopupActionStyled>
            <CardContent>
                <Typography gutterBottom variant="subtitle2" fontWeight={600}>
                    {t("dialogs.finish-dialog.title")}
                </Typography>
                <Card>
                    <List>
                        <ListItem>
                            <Stack spacing={1} direction='row' alignItems="flex-start">
                                <Box>
                                    <Avatar src="/static/icons/men-avatar.svg" sx={{width: 60, height: 60}}/>
                                    <Typography fontWeight={700} gutterBottom>
                                        {data.name}
                                    </Typography>
                                    {/*<Stack spacing={0.2} direction='row' alignItems="center">
                                        <IconUrl path='ic-tel' className="ic-tel"/>
                                        <Link underline="none" href={`tel:`} sx={{ml: 1, fontSize: 12}}
                                              color="text.primary" fontWeight={400}>
                                            {data.phone}
                                        </Link>
                                    </Stack>*/}
                                </Box>
                            </Stack>
                        </ListItem>
                        <ListItem>
                            <Stack spacing={4} direction="row" alignItems='center'>
                                <Stack spacing={0.5} direction="row" alignItems='center'>
                                    <Typography fontWeight={600}>
                                        {t("dialogs.finish-dialog.sub-title")}
                                    </Typography>
                                </Stack>
                                <Stack spacing={0.5} direction="row" alignItems='center'>
                                    <Button
                                        sx={{
                                            borderColor: 'divider',
                                            bgcolor: theme => theme.palette.grey['A500'],
                                        }}
                                        startIcon={data.restAmount === 0 ? <CheckIcon/> :
                                            <IconUrl path={'ic-argent'}/>}
                                        variant="outlined"
                                        color="info"
                                        onClick={OnPay}>
                                        <Typography>{t("pay")}</Typography>
                                        {data.restAmount > 0 &&
                                            <>
                                                <Typography component='span'
                                                            fontWeight={700}
                                                            variant="subtitle2" ml={1}>
                                                    {data.restAmount}
                                                </Typography>
                                                <Typography fontSize={10}>{devise}</Typography>
                                            </>
                                        }
                                    </Button>
                                </Stack>
                            </Stack>
                        </ListItem>
                        <ListItem>
                            <textarea rows={6} readOnly
                                      defaultValue={instruction}/>
                        </ListItem>
                    </List>
                </Card>
                <Stack mt={1} spacing={2} justifyContent={"flex-end"} direction={{xs: 'column', md: "row"}}>
                    {isBeta && <LoadingButton
                        loading={loadingRequest}
                        loadingPosition={"start"}
                        disabled={data.payed}
                        onClick={OnPay}
                        variant="contained"
                        startIcon={<PaymentRoundedIcon/>}>
                        {t("dialogs.finish-dialog.pay")}
                    </LoadingButton>}
                    <Button
                        onClick={OnSchedule}
                        variant="contained"
                        startIcon={<LocalHospitalOutlinedIcon/>}>
                        {t("dialogs.finish-dialog.reschedule")}
                    </Button>
                </Stack>
            </CardContent>
        </ConsultationPopupActionStyled>
    )
}

export default ConsultationPopupAction;
