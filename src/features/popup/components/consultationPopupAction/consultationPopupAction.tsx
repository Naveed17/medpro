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
import {LoadingButton} from "@mui/lab";
import {dashLayoutSelector} from "@features/base";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";

function ConsultationPopupAction({...props}) {
    const {data, OnSchedule, OnPay} = props
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation("common");
    const {newCashBox} = useAppSelector(dashLayoutSelector)
    const {config: agenda, selectedEvent: appointment} = useAppSelector(agendaSelector);

    const [instruction] = useState(`${data.control ? `${t("next-appointment-control")} ${data.nextAppointment} ${t("times.days")} \r\n` : ""}, ${data.instruction}`);
    const [loadingRequest, setLoadingRequest] = useState(false);

    const {trigger: triggerTransactions} = useRequestMutation(null, "agenda/appointment/transactions");

    const getAllTransactions = () => {
        setLoadingRequest(true);
        triggerTransactions({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${data.appUuid}/transactions/${router.locale}`,
        }).then((result) => {
            const transactionsData = (result?.data as HttpResponse)?.data;
            dispatch(setSelectedEvent({
                ...appointment,
                extendedProps: {
                    ...appointment?.extendedProps,
                    patient: transactionsData.transactions[0]?.appointment?.patient,
                    total: data.fees,
                    transactions: transactionsData.transactions
                }
            } as any));
            OnPay();
            setLoadingRequest(false);
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
                                        color={data.payed ? "success" : "warning"}
                                        label={`${data.restAmount !== 0 ? (data.fees - data.restAmount) + '/' : ''}${data.fees} ${data.devise}`}
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
                    {newCashBox && <LoadingButton
                        loading={loadingRequest}
                        loadingPosition={"start"}
                        disabled={data.payed}
                        onClick={getAllTransactions}
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
