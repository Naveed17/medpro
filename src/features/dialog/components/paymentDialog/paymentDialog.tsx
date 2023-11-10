import React, {useEffect, useState,} from "react";
import {
    Avatar,
    Button,
    Card,
    CardContent,
    Grid,
    Menu,
    MenuItem,
    Stack,
    Theme,
    Typography,
    useTheme,
} from "@mui/material";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import {DefaultCountry, TransactionType} from "@lib/constants";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useAppSelector} from "@lib/redux/hooks";
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import PaymentCard from "@features/dialog/components/paymentDialog/paymentCard";
import PaymentDialogStyled from "./overrides/paymentDialogStyle";
import ConsultationCard from "@features/dialog/components/paymentDialog/consultationCard";
import AddIcon from "@mui/icons-material/Add";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import IconUrl from "@themes/urlIcon";
import moment from "moment/moment";
import {Box} from "@mui/system";

const LoadingScreen = dynamic(
    () => import("@features/loadingScreen/components/loadingScreen")
);

function PaymentDialog({...props}) {
    const {data} = props;
    const theme = useTheme<Theme>();
    const {data: session} = useSession();
    const {selectedBoxes} = useAppSelector(cashBoxSelector);

    const [payments, setPayments] = useState<any>([]);
    const [appointments, setAppointments] = useState<any>(['', '', '']);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [patientTransactions, setPatientTransactions] = React.useState([]);

    const {data: user} = session as Session;
    const {t, ready} = useTranslation("payment");
    const {paymentTypesList} = useAppSelector(cashBoxSelector);

    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const router = useRouter();
    const open = Boolean(anchorEl);
    const {trigger: triggerAppointmentEdit} = useRequestQueryMutation("appointment/edit");

    const {patient, setOpenPaymentDialog, mutatePatient = null} = data;

    /*
        const isMobile = useMediaQuery((theme: Theme) =>
            theme.breakpoints.down("sm")
        );
    */

    const medical_entity = (user as UserDataResponse)
        .medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country
        ? medical_entity.country
        : DefaultCountry;
    const devise = doctor_country.currency?.name;


    const {data: httpPatientTransactions, mutate} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/patients/${patient.uuid}/transactions/${router.locale}`
    });

    const generateTransactionData = (_amount: number) => {
        let transaction_data: any[] = [];
        appointments.filter((app: { checked: boolean; }) => app.checked).map((app: {
            rest_amount: number;
            uuid: string;
        }) => {

            if (_amount === 0)
                return;
            if (_amount >= app.rest_amount) {
                _amount -= app.rest_amount
                transaction_data.push({
                    appointment: app.uuid,
                    amount: app.rest_amount
                })
            } else {
                transaction_data.push({
                    appointment: app.uuid,
                    amount: _amount
                })
                _amount = 0
            }
        })

        return transaction_data;
    }

    const payWithAvance = (tr: any) => {
        const transaction_data: any = generateTransactionData(tr.restAmount);

        const form = new FormData();
        form.append("transaction_data", JSON.stringify(transaction_data));
        triggerAppointmentEdit({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/transactions/${tr.uuid}/transaction-data/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                mutate().then(() => {
                    mutatePatient && mutatePatient();
                });
            },
        });
    }

    const addTransactions = () => {
        let amount = 0;
        let payment_means: any[] = []
        payments.map((pay: { amount: number; selected: boolean; data: any }) => {
            amount += pay.amount
            payment_means.push({
                uuid: paymentTypesList.find((p: { slug: boolean; }) => p.slug === pay.selected).uuid,
                amount: pay.amount, ...(pay.data && {data: pay.data})
            })
        })

        let _amount = amount;
        let transaction_data = generateTransactionData(_amount)

        const form = new FormData();
        form.append("cash_box", selectedBoxes[0].uuid);
        form.append("type_transaction", TransactionType[0].value);
        form.append("amount", amount.toString());
        form.append("payment_means", JSON.stringify(payment_means));
        form.append("patient", patient.uuid);
        form.append("transaction_data", JSON.stringify(transaction_data));

        triggerAppointmentEdit({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/transactions/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                mutate().then(() => {
                    mutatePatient && mutatePatient();
                    setOpenPaymentDialog(false)
                });
            },
        });
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangePayment = (props: string) => {
        const amount = getTotalApps() - getTotalPayments();
        let pay = props === 'check' ? {
            selected: props,
            amount: amount > 0 ? amount : 0,
            data: {carrier: '', bank: '', nb: '', date: moment()}
        } : {selected: props, amount: amount > 0 ? amount : 0};
        let _payments = [...payments, pay]
        setPayments(_payments)
        handleClose();
    };

    const getTotalApps = () => {
        return appointments.filter((app: { checked: boolean; }) => app.checked).reduce((total: number, val: {
            rest_amount: number
        }) => total + val.rest_amount, 0);
    }

    const getTotalPayments = () => {
        return payments.reduce((total: number, val: { amount: number }) => total + val.amount, 0);
    }

    useEffect(() => {
        if (httpPatientTransactions) {
            const res = (httpPatientTransactions as HttpResponse).data
            setPatientTransactions(res.patient_transaction)
            let total = 0;
            let apps: any[] = [];
            res.appointments?.map((app: any) => {
                apps.push({
                    uuid: app.uuid,
                    rest_amount: app.rest_amount,
                    fees: app.fees,
                    start_date: app.start_date,
                    day_date: app.day_date,
                    checked: true
                })
                total += app.rest_amount
            })
            setAppointments(apps.sort((a, b) => (a.day_date > b.day_date) ? 1 : -1));
            setPayments([{selected: 'cash', amount: total}])
        }
    }, [httpPatientTransactions])

    if (!ready) return <LoadingScreen button text={"loading-error"}/>;

    return (
        <PaymentDialogStyled>
            <Grid container spacing={{xs: 2, md: 6}}>
                <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                        <Stack direction={"row"} justifyContent={"space-between"}>
                            <Stack spacing={2} direction="row" alignItems="center">
                                <Avatar
                                    sx={{width: 42, height: 42}}
                                    src={`/static/icons/${patient?.gender !== "O" ? "men" : "women"}-avatar.svg`}/>
                                <Stack>
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Typography fontWeight={700}>
                                            {patient.firstName} {patient.lastName}
                                        </Typography>
                                    </Stack>

                                    {patient.contact?.length && (
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <IconUrl path="ic-tel" color={theme.palette.text.primary}/>
                                            <Typography variant="body2" alignItems="center">
                                                {patient.contact[0].value ? patient.contact[0].value : patient.contact[0]}
                                            </Typography>
                                        </Stack>
                                    )}
                                </Stack>
                            </Stack>
                        </Stack>
                        {
                            appointments.length > 0 ? <>
                            <Typography fontSize={14} fontWeight={"bold"}>{t('dialog.leftPay')}</Typography>
                            <ConsultationCard {...{
                                appointments,
                                setAppointments,
                                payments,
                                getTotalApps,
                                getTotalPayments,
                                t,
                                theme,
                                devise
                            }}/>
                        </>:<Box style={{width:"100%",height:"50vh",
                                display:'flex',
                                justifyContent:"center",
                                alignItems:"center"}}>
                            <Typography>No transaction</Typography>
                        </Box>
                        }
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                        <Stack direction={{xs: "column", sm: "row"}}
                               alignItems="center"
                               justifyContent="space-between"
                               spacing={{xs: 2, sm: 0}}>
                            <Typography fontWeight={600} mb={1}>
                                {t("payment")}
                            </Typography>
                            <Button startIcon={<AddIcon/>}
                                    endIcon={<UnfoldMoreRoundedIcon/>}
                                    id="basic-button"
                                    variant="contained"
                                    aria-controls={open ? "basic-menu" : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                    onClick={handleClick}
                            >
                                {t("add_payment")}
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    "aria-labelledby": "basic-button",
                                    sx: {
                                        minWidth: 200,
                                        padding: 0,
                                        li: {
                                            borderBottom: 1,
                                            borderColor: "divider",
                                            "&:last-child": {
                                                borderBottom: 0,
                                            },
                                        },
                                    },
                                }}
                            >
                                {paymentTypesList?.map((payment: any) => (
                                    <MenuItem
                                        onClick={() => handleChangePayment(payment.slug)}
                                        key={payment.uuid}
                                    >
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                style={{width: 16}}
                                                src={payment?.logoUrl?.url}
                                                alt={"payment means"}
                                            />
                                            <Typography>{t(payment?.name)}</Typography>
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Stack>


                        {patientTransactions && patientTransactions.length > 0 && <Card className={"payment-card"}>
                            <CardContent>
                                <Stack spacing={1}>
                                    <Typography fontSize={14} fontWeight={"bold"}>{t('dialog.avance')}</Typography>
                                    {patientTransactions.map((transaction: any, index) => (
                                        <Card key={index} style={{padding: 10}}>
                                            <Stack direction={"row"} justifyContent={"space-between"}>
                                                <Stack>
                                                    <Typography
                                                        fontSize={12}>{transaction.payment_means.map((tr: any) => (tr.paymentMeans.name + ' '))}</Typography>
                                                    <Stack direction="row"
                                                           alignItems="center"
                                                           spacing={0.5}>
                                                        <IconUrl path={"ic-agenda"}
                                                                 width={12}
                                                                 height={12}
                                                                 color={theme.palette.text.secondary}/>
                                                        <Typography variant="body2">
                                                            {moment(transaction.date_transaction, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY')}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                                <Button size={"small"}
                                                        variant={"contained"}
                                                        onClick={() => payWithAvance(transaction)}
                                                        startIcon={<IconUrl path={"ic-argent"}/>}>
                                                    {t('dialog.use')} {transaction.restAmount} {devise}
                                                </Button>
                                            </Stack>
                                        </Card>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>}

                        {payments.map((item: any, i: number) => (
                            <PaymentCard key={i} {...{
                                t,
                                paymentTypesList,
                                item,
                                i,
                                devise,
                                payments,
                                setPayments,
                                addTransactions
                            }}/>
                        ))}
                    </Stack>
                </Grid>
            </Grid>
            <Box style={{height: 70}}/>
            <Stack direction={"row"} style={{
                position: 'absolute',
                bottom: 2,
                width: "95%",
                borderTop: "1px solid #ddd",
                backgroundColor: "white",
                padding: "15px 0"
            }} justifyContent={"flex-end"} spacing={1}>
                <Button onClick={() => setOpenPaymentDialog(false)}>{t('cancel')}</Button>
                <Button disabled={getTotalPayments() === 0}
                        startIcon={<IconUrl path={'ic-argent'}/>}
                        endIcon={<AddIcon/>}
                        variant={"contained"}
                        onClick={() => addTransactions()}>
                    {t('dialog.pay')} {getTotalPayments()} {devise}
                </Button>
            </Stack>
        </PaymentDialogStyled>
    );
}

export default PaymentDialog;
