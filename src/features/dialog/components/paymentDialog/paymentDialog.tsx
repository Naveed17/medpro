import React, {useEffect, useState,} from "react";
import {Avatar, Button, Grid, Stack, Theme, Typography, useMediaQuery, useTheme,} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import {FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import {DefaultCountry} from "@lib/constants";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useAppSelector} from "@lib/redux/hooks";
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import {useRequestQuery} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import {agendaSelector} from "@features/calendar";
import PaymentCard from "@features/dialog/components/paymentDialog/paymentCard";
import PaymentDialogStyled from "./overrides/paymentDialogStyle";
import ConsultationCard from "@features/dialog/components/paymentDialog/consultationCard";

const LoadingScreen = dynamic(
    () => import("@features/loadingScreen/components/loadingScreen")
);

function PaymentDialog({...props}) {
    const {data} = props;
    const theme = useTheme<Theme>();
    const {data: session} = useSession();

    const [payments, setPayments] = useState<any>([]);
    const [wallet, setWallet] = useState(0);
    const [rest, setRest] = useState(0);
    const [appointment, setAppointment] = useState<any>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const {data: user} = session as Session;
    const {t, ready} = useTranslation("payment");
    const {paymentTypesList} = useAppSelector(cashBoxSelector);
    const {config: agenda} = useAppSelector(agendaSelector);

    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const router = useRouter();


    const {app_uuid, patient} = data;

    const isMobile = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down("sm")
    );

    const medical_entity = (user as UserDataResponse)
        .medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country
        ? medical_entity.country
        : DefaultCountry;
    const devise = doctor_country.currency?.name;
    const deals = {
        cash: {
            amount: rest,
        },
        check: [
            {
                amount: rest,
                carrier: patient ? `${patient.firstName} ${patient.lastName}` : "",
                bank: "",
                check_number: "",
                payment_date: new Date(),
                expiry_date: new Date(),
            },
        ],
    }

    const validationSchema = Yup.object().shape({
        totalToPay: Yup.number(),
    });

    const formik = useFormik({
        initialValues: {
            ...deals,
            totalToPay: 0,
            paymentMethods: [
                {
                    selected:
                        paymentTypesList && paymentTypesList.length > 0
                            ? paymentTypesList[0].slug
                            : null,
                    ...deals,
                    ...(wallet > 0 && {
                        wallet,
                    }),
                },
            ],
        },
        validationSchema,
        onSubmit: (values) => {
            console.log(values);
        },
    });

    const {data: httpAppointmentTransactions, mutate} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/transactions/${router.locale}`
    });

    const calculInsurance = () => {
        return 0
    };

    const addTransactions = (item: { amount: number }) => {
        /*const form = new FormData();
        form.append("cash_box", selectedBoxes[0].uuid);
        form.append("type_transaction", TransactionType[0].value);
        form.append("amount", item.amount.toString());
        form.append("payment_means", "d72700cc-e540-4ace-9e78-bdfa9f71e33e");
        form.append("patient", patient.uuid);
        form.append("transaction_data", JSON.stringify(transactionData));

        triggerAppointmentEdit({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/transactions/${router.locale}`,
            data: form
        }, {
            onSuccess: (res) => {
                console.log(res)
                mutate();
            },
        });*/
    }

    useEffect(() => {
        if (httpAppointmentTransactions) {
            const res = (httpAppointmentTransactions as HttpResponse).data
            setAppointment({uuid: app_uuid, ...res})
            let amount = res.rest_amount;
            console.log(res)
            let transaction_data = [{
                appointment: app_uuid,
                amount: res.rest_amount,
                current: true
                //data:{fees:res.fees,date:'Aujourd\'hui'}
            }]
            res.appointments.map((app: { rest_amount: number; uuid: string; }) => {
                amount += app.rest_amount
                transaction_data = [...transaction_data, {
                    appointment: app.uuid,
                    amount: app.rest_amount,
                    current: false
                    //data:{fees:app.fees,date:app.day_date}
                }]
            })
            setPayments([{selected: 'cash', amount, transaction_data}])
        }
    }, [app_uuid, httpAppointmentTransactions])

    useEffect(() => {
        //console.log(payments)
    }, [payments])

    if (!ready) return <LoadingScreen button text={"loading-error"}/>;

    return (
        <FormikProvider value={formik}>
            <PaymentDialogStyled>
                {patient && (
                    <Stack
                        spacing={2}
                        direction={{xs: patient ? "column" : "row", sm: "row"}}
                        alignItems="center"
                        justifyContent={patient ? "space-between" : "flex-end"}
                        mb={2}
                    >
                        <Stack spacing={2} direction="row" alignItems="center">
                            <Avatar
                                sx={{width: 42, height: 42}}
                                src={`/static/icons/${
                                    patient?.gender !== "O" ? "men" : "women"
                                }-avatar.svg`}
                            />
                            <Stack>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography fontWeight={700}>
                                        {patient.firstName} {patient.lastName}
                                    </Typography>
                                </Stack>

                                {patient.contact.length && (
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <IconUrl path="ic-tel" color={theme.palette.text.primary}/>
                                        <Typography variant="body2" alignItems="center">
                                            {patient.contact[0]}
                                        </Typography>
                                    </Stack>
                                )}
                            </Stack>
                        </Stack>

                        {appointment && (
                            <Stack
                                direction={{xs: "column", sm: "row"}}
                                alignItems="center"
                                justifyContent={{xs: "center", sm: "flex-start"}}
                                sx={{
                                    "& .MuiButtonBase-root": {
                                        fontSize: 13,
                                    },
                                }}
                                {...(wallet > 0 && {
                                    sx: {
                                        flexWrap: "wrap",
                                    },
                                })}
                                spacing={1}
                            >
                                {wallet > 0 && (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="success"
                                        {...(isMobile && {
                                            fullWidth: true,
                                        })}
                                    >
                                        {t("wallet")}
                                        <Typography fontWeight={700} component="strong" mx={1}>
                                            {wallet}
                                        </Typography>
                                        {devise}
                                    </Button>
                                )}
                                {calculInsurance() > 0 &&
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        {...(isMobile && {
                                            fullWidth: true,
                                        })}
                                    >
                                        {t("insurance_total")}
                                        <Typography fontWeight={700} component="strong" mx={1}>
                                            {calculInsurance().toFixed(3)}
                                        </Typography>
                                        {devise}
                                    </Button>}

                                <Button
                                    size="small"
                                    variant="contained"
                                    color={rest === 0 ? "success" : "error"}
                                    {...(isMobile && {fullWidth: true})}>
                                    {t("btn_remain")}
                                    <Typography fontWeight={700} component="strong" mx={1}>
                                        {rest.toFixed(3)}
                                    </Typography>
                                    {devise}
                                </Button>

                                <Button
                                    size="small"
                                    variant="contained"
                                    color={rest === 0 ? "success" : "warning"}
                                    {...(isMobile && {
                                        fullWidth: true,
                                    })}>
                                    {t("total")}
                                    <Typography fontWeight={700} component="strong" mx={1}>
                                        0
                                    </Typography>
                                    {devise}
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                )}

                <Grid container spacing={{xs: 2, md: 6}}>
                    <Grid item xs={12} sm={6}>
                        <Typography fontWeight={600} mb={1}>
                            {t("current_consultation")}
                        </Typography>
                        <Stack spacing={1}>
                            {appointment &&
                                <ConsultationCard {...{t, devise, appointment, setOpenDialog, rest, payments}} />}
                        </Stack>

                        {appointment?.appointments.length > 0 && <Typography fontWeight={700}>
                            {t("other_consultation")}
                        </Typography>}
                        {appointment?.appointments.length > 0 && <Stack
                            spacing={1}
                            borderRadius={0.5}
                            maxHeight={244}
                            p={1}
                            sx={{overflowY: "auto", bgcolor: theme.palette.back.main}}>
                            {appointment && appointment.appointments.map((app: { uuid: string }, index: number) => (
                                <ConsultationCard key={`${app.uuid}-${index}`} {...{t, devise, appointment: app}} />))}
                        </Stack>}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography fontWeight={600} mb={1}>
                            {t("payment")}
                        </Typography>
                        {payments.map((item: any, i: number) => (
                            <PaymentCard key={i} {...{
                                t,
                                paymentTypesList,
                                item,
                                i,
                                devise,
                                wallet,
                                payments,
                                setPayments,
                                appointment,
                                setAppointment,
                                addTransactions
                            }}/>
                        ))}
                    </Grid>
                </Grid>
            </PaymentDialogStyled>

        </FormikProvider>
    );
}

export default PaymentDialog;
