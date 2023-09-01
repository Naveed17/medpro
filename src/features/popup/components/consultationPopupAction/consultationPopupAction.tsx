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
    Link,
    Button, Chip
} from '@mui/material'
import IconUrl from "@themes/urlIcon";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import * as React from "react";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {useState} from "react";
import {useRequestMutation} from "@lib/axios";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {agendaSelector, setSelectedEvent} from "@features/calendar";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";

function ConsultationPopupAction({...props}) {
    const {data, OnSchedule, OnPay} = props
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation("common");
    const {config: agenda, selectedEvent: appointment} = useAppSelector(agendaSelector);

    const [instruction] = useState(`${data.control ? `${t("next-appointment-control")} ${data.nextAppointment} ${t("times.days")} \r\n` : ""}, ${data.instruction}`);

    const {trigger: triggerTransactions} = useRequestMutation(null, "agenda/appointment/transactions");

    const getAllTransactions = () => {
        triggerTransactions({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${data.appUuid}/transactions/${router.locale}`,
        }).then((result) => {
            const transactions = (result?.data as HttpResponse)?.data;
            dispatch(setSelectedEvent({
                ...appointment,
                extendedProps: {
                    ...appointment?.extendedProps,
                    transactions
                }
            } as any));
            OnPay();
        });
    }

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
                                    <Stack spacing={0.2} direction='row' alignItems="center">
                                        <IconUrl path='ic-tel' className="ic-tel"/>
                                        <Link underline="none" href={`tel:`} sx={{ml: 1, fontSize: 12}}
                                              color="text.primary" fontWeight={400}>
                                            {data.phone}
                                        </Link>
                                    </Stack>
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
                                    <Chip
                                        color="success"
                                        label={`${data.fees} ${data.devise}`}
                                    />
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
                    <Button
                        onClick={getAllTransactions}
                        variant="contained" startIcon={<PaymentRoundedIcon/>}>
                        {t("dialogs.finish-dialog.pay")}
                    </Button>
                    <Button
                        onClick={OnSchedule}
                        variant="contained" startIcon={<LocalHospitalOutlinedIcon/>}>
                        {t("dialogs.finish-dialog.reschedule")}
                    </Button>
                </Stack>
            </CardContent>
        </ConsultationPopupActionStyled>
    )
}

export default ConsultationPopupAction;
