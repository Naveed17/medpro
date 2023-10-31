import React, {useEffect, useRef, useState,} from "react";
import PaymentDialogStyled from "./overrides/paymentDialogStyle";
import {
    Avatar,
    Box,
    Button,
    Divider,
    Grid,
    Menu,
    MenuItem,
    Stack,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {AnimatePresence, motion} from "framer-motion";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import {FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import {DefaultCountry} from "@lib/constants";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import AddIcon from "@mui/icons-material/Add";
import {useAppSelector} from "@lib/redux/hooks";
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {dashLayoutSelector} from "@features/base";
import {useRouter} from "next/router";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import ConsultationCard from "./consultationCard";
import PaymentCard from "./paymentCard";
import {agendaSelector} from "@features/calendar";

const LoadingScreen = dynamic(
    () => import("@features/loadingScreen/components/loadingScreen")
);

function PaymentDialog({...props}) {
    const {data} = props;
    const theme = useTheme<Theme>();
    const {data: session} = useSession();
    const ref = useRef(null);
    const scrollToView = () => {
        setTimeout(() => {
            (ref.current as unknown as HTMLElement)?.scrollIntoView({
                behavior: "smooth",
            });
        }, 300);
    };

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [payments, setPayments] = useState<any>([]);
    const [wallet, setWallet] = useState(0);
    const [rest, setRest] = useState(0);
    const [appointment, setAppointment] = useState(null);
    const [transactionData, setTransactionData] = useState([]);

    const open = Boolean(anchorEl);
    const {data: user} = session as Session;
    const {t, ready} = useTranslation("payment");
    const {paymentTypesList} = useAppSelector(cashBoxSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {config: agenda} = useAppSelector(agendaSelector);
    const {selectedBoxes} = useAppSelector(cashBoxSelector);

    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const router = useRouter();
    /*
        const {banks} = useBanks();
        const {insurances} = useInsurances();
    */
    const {trigger: triggerAppointmentEdit} = useRequestQueryMutation("appointment/edit");


    const {app_uuid, patient} = data;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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

    const {data: httpPatientWallet} = useRequestQuery(
        medicalEntityHasUser
            ? {
                method: "GET",
                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/wallet/${router.locale}`,
            }
            : null
    );

    const {data: httpPatientTransactions, mutate: mutatePatientT} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/patients/${patient?.uuid}/transactions/${router.locale}`
    });

    const {data: httpAppointmentTransactions, mutate} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/transactions/${router.locale}`
    });

    const handleChangePayment = (props: string) => {

        scrollToView();
        let data:any = {selected: props, amount: 0}
        if (props === 'check')
            data = {...data, data:{bank: '', carrier: '', nb: '', date: new Date()}}
        setPayments([...payments,data])
        handleClose();
    };

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
        console.log(payments)
        console.log(payments.reduce((total:number,val:any) =>total + parseInt(val.amount),0))
    }

    /*const checkCheques = () => {
        if (selectedPayment.uuid !== "") {
            let total = 0;
            let hasEmpty = false;
            values.check.map((check: { amount: number }) => {
                if (check.amount.toString() === "") hasEmpty = true;
                else total += check.amount;
            });
            return hasEmpty ? hasEmpty : total > rest;
        } else {
            let hasEmpty = false;
            let total = 0;
            values.check.map((check: { amount: number }) => {
                if (check.amount.toString() === "") hasEmpty = true;
                else total += check.amount;
            });
            return hasEmpty;
        }
    };*/

    /*
        const getHours = () => {
            return `${new Date().getHours()}:${new Date().getMinutes()}`;
        };
    */


    useEffect(() => {
        if (httpPatientWallet) {
            const data = (httpPatientWallet as HttpResponse).data;
            setWallet(data.wallet);
            setRest(data.rest_amount)
        }
    }, [httpPatientWallet]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        console.log(httpPatientTransactions)
    }, [httpPatientTransactions])

    useEffect(() => {
        if (httpAppointmentTransactions) {
            const res = (httpAppointmentTransactions as HttpResponse).data
            console.log(res)
            setRest(r => r + res.rest_amount)
            setAppointment({uuid: app_uuid, ...res})
        }
    }, [app_uuid, httpAppointmentTransactions])

    useEffect(() => {
        setPayments([{selected: 'cash', amount: rest}])
    }, [rest])

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
                            <ConsultationCard {...{t, devise, appointment, addTransactions, rest}} />
                        </Stack>
                        <Typography my={1} fontWeight={700}>
                            {t("other_consultation")}
                        </Typography>
                        <Stack
                            spacing={1}
                            borderRadius={0.5}
                            maxHeight={244}
                            p={1}
                            sx={{overflowY: "auto", bgcolor: theme.palette.back.main}}
                        >
                            <ConsultationCard {...{t, devise}} />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={2} height={1} position={"relative"}>
                            <Divider
                                orientation="vertical"
                                sx={{
                                    position: "absolute",
                                    height: "100%",
                                    left: -24,
                                    display: {xs: "none", md: "block"},
                                }}
                            />
                            <Stack
                                direction={{xs: "column", sm: "row"}}
                                alignItems="center"
                                justifyContent="space-between"
                                spacing={{xs: 2, sm: 0}}
                            >
                                <Typography fontWeight={600} mb={1}>
                                    {t("payment")}
                                </Typography>
                                <Button
                                    startIcon={<AddIcon/>}
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
                                    {wallet > 0 ? (
                                        <MenuItem onClick={() => handleChangePayment("wallet")}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    style={{width: 16}}
                                                    src={"/static/icons/ic-wallet-money.svg"}
                                                    alt={"payment means"}
                                                />
                                                <Typography>{t("wallet")}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {wallet} {devise}
                                                </Typography>
                                            </Stack>
                                        </MenuItem>
                                    ) : null}
                                </Menu>
                            </Stack>
                            <Stack maxHeight={300} p={1} overflow="auto" spacing={2}>
                                <AnimatePresence>
                                    {payments.map((item: any, i: any) => (
                                        <motion.div
                                            key={i}
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            exit={{opacity: 0}}
                                            transition={{duration: 0.3}}
                                        >
                                            <PaymentCard
                                                {...{
                                                    t,
                                                    devise,
                                                    paymentTypesList,
                                                    payments, setPayments,
                                                    addTransactions,
                                                    item,
                                                    i,
                                                    wallet,
                                                }}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <Box ref={ref}/>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </PaymentDialogStyled>
        </FormikProvider>
    );
}

export default PaymentDialog;
