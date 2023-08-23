import React, {useEffect, useState} from 'react'
import PaymentDialogStyled from './overrides/paymentDialogStyle';
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    Paper,
    Stack,
    TextField,
    Theme,
    Typography,
    useMediaQuery
} from '@mui/material'
import IconUrl from '@themes/urlIcon';
import {AnimatePresence, motion} from 'framer-motion';
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import {FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import {DefaultCountry, TransactionStatus, TransactionType} from "@lib/constants";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import AddIcon from "@mui/icons-material/Add";
import {MobileContainer} from "@themes/mobileContainer";
import {PaymentDialogMobileCard} from "@features/card";
import {Otable} from "@features/table";
import {DesktopContainer} from "@themes/desktopConainter";
import moment from "moment-timezone";
import {useAppSelector} from "@lib/redux/hooks";
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import {DatePicker} from "@features/datepicker";
import {useInsurances} from "@lib/hooks/rest";
import {useRequest} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {dashLayoutSelector} from "@features/base";
import {useRouter} from "next/router";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
    align: "left" | "right" | "center";
}

const headCells: readonly HeadCell[] = [
    {
        id: "date",
        numeric: false,
        disablePadding: true,
        label: "date",
        sortable: true,
        align: "left",
    },
    /*{
        id: "time",
        numeric: false,
        disablePadding: true,
        label: "time",
        sortable: true,
        align: "left",
    },*/
    {
        id: "amount",
        numeric: true,
        disablePadding: false,
        label: "amount",
        sortable: true,
        align: "left",
    },
    {
        id: "method",
        numeric: true,
        disablePadding: false,
        label: "method",
        sortable: true,
        align: "right",
    },
];

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
}

const variants = {
    initial: {opacity: 0,},
    animate: {
        opacity: 1,
        transition: {
            delay: 0.1,
        }
    }
};

function TabPanel(props: TabPanelProps) {
    const {children, index, ...other} = props;
    return (
        <motion.div
            key={index}
            variants={variants}
            initial="initial"
            animate={"animate"}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            className="tab-panel"
            {...other}
        >
            {children}
        </motion.div>
    );
}

function PaymentDialog({...props}) {
    const {data} = props;
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const {t, ready} = useTranslation("payment");

    const {paymentTypesList} = useAppSelector(cashBoxSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {insurances} = useInsurances();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const router = useRouter();

    const {appointment, selectedPayment, setSelectedPayment, patient} = data;

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

    const [payments, setPayments] = useState<any>([...selectedPayment.payments]);
    const [label, setLabel] = useState('');
    const [byRate, setByRate] = useState(false);
    const [wallet, setWallet] = useState(0);
    const [deals, setDeals] = React.useState<any>({
        cash: {
            amount: selectedPayment.total > 0 && payments.length === 0 ? selectedPayment.total - selectedPayment.payed_amount : ""
        },
        card: {
            amount: selectedPayment.total > 0 && payments.length === 0 ? selectedPayment.total - selectedPayment.payed_amount : ""
        },
        check: [{
            amount: selectedPayment.total > 0 && payments.length === 0 ? selectedPayment.total - selectedPayment.payed_amount : "",
            carrier: "",
            bank: "",
            check_number: '',
            payment_date: new Date(),
            expiry_date: new Date(),
        }],
        selected: paymentTypesList && paymentTypesList.length > 0 ? paymentTypesList[0].slug : null
    });

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;
    const maxLength = patient && patient.insurances ? patient.insurances.length + paymentTypesList.length : 1;

    const validationSchema = Yup.object().shape({
        totalToPay: Yup.number()
    });

    const formik = useFormik({
        initialValues: {
            ...deals,
            totalToPay: selectedPayment.total - selectedPayment.payed_amount
        },
        validationSchema,
        onSubmit: values => {
            console.log(values);
        },
    });

    const {values, errors, touched, getFieldProps, setFieldValue, resetForm} = formik;

    const {data: httpPatientWallet} = useRequest(medicalEntityHasUser && appointment ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/wallet/${router.locale}`
    } : null);


    useEffect(() => {
        setSelectedPayment({
            ...selectedPayment,
            payments
        });
    }, [payments]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (httpPatientWallet) {
            const w = (httpPatientWallet as HttpResponse).data.wallet
            setWallet(w)
        }
    }, [httpPatientWallet]); // eslint-disable-line react-hooks/exhaustive-deps
    const handleAddStep = () => {
        const step = [...values.check, {
            amount: "",
            carrier: "",
            bank: "",
            check_number: '',
            payment_date: new Date(),
            expiry_date: new Date(),
        }];
        setFieldValue("check", step);
    };
    const handleDeleteStep = (props: any) => {
        const filter = values.check.filter((item: any) => item !== props)
        setFieldValue("check", filter);
    }
    const calculInsurance = () => {
        let total = 0
        payments.map((pay: { insurance: string; amount: number; }) => {
            if (pay.insurance) total += pay.amount
        })
        return total
    }
    const checkCheques = () => {
        if (selectedPayment.uuid !== "") {
            let total = 0;
            let hasEmpty = false;
            values.check.map((check: { amount: number }) => {
                if (check.amount.toString() === "")
                    hasEmpty = true;
                else total += check.amount;
            });
            return hasEmpty ? hasEmpty : total > calculRest();
        } else {
            let hasEmpty = false;
            let total = 0;
            values.check.map((check: { amount: number }) => {
                if (check.amount.toString() === "")
                    hasEmpty = true;
                else total += check.amount;
            });
            return hasEmpty
        }

    }
    const calculRest = () => {
        let paymentTotal = 0
        selectedPayment.payments.map((pay: { amount: number; }) => paymentTotal += pay.amount)
        return selectedPayment.total - paymentTotal
    }
    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <FormikProvider value={formik}>
            <PaymentDialogStyled>
                {patient &&
                    <Stack spacing={2}
                           direction={{xs: patient ? 'column' : 'row', sm: 'row'}}
                           alignItems='center'
                           justifyContent={patient ? 'space-between' : 'flex-end'}>
                        <Stack spacing={2} direction="row" alignItems='center'>
                            <Avatar sx={{width: 26, height: 26}}
                                    src={`/static/icons/${patient?.gender !== "O" ? "men" : "women"}-avatar.svg`}/>
                            <Stack>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography color="primary">
                                        {patient.firstName} {patient.lastName}
                                    </Typography>
                                </Stack>

                                {patient.birthdate &&
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <IconUrl path="ic-anniverssaire"/>
                                        <Typography variant='body2' color="text.secondary" alignItems='center'>
                                            {patient.birthdate}
                                        </Typography>
                                    </Stack>}
                            </Stack>
                        </Stack>

                        {appointment && <Stack

                            direction={{xs: 'column', sm: 'row'}}
                            alignItems="center"
                            justifyContent={{xs: 'center', sm: 'flex-start'}}
                            sx={{
                                "& .MuiButtonBase-root": {
                                    fontSize: 13
                                }
                            }}
                            {...(wallet > 0 && {
                                sx: {
                                    flexWrap: 'wrap',

                                }
                            })}
                            spacing={1}>

                            {wallet > 0 && <Button size='small' variant='contained' color="success"
                                                   {...(isMobile && {
                                                       fullWidth: true
                                                   })}
                            >
                                {t("wallet")}
                                <Typography
                                    fontWeight={700}
                                    component='strong'
                                    mx={1}>{wallet}</Typography>
                                {devise}
                            </Button>}
                            <Button size='small' variant='contained' color="primary"
                                    {...(isMobile && {
                                        fullWidth: true
                                    })}
                            >
                                {t("insurance_total")}
                                <Typography
                                    fontWeight={700}
                                    component='strong'
                                    mx={1}>{calculInsurance()}</Typography>
                                {devise}
                            </Button>

                            <Button size='small' variant='contained' color={calculRest() === 0 ? "success" : "error"}
                                    {...(isMobile && {
                                        fullWidth: true
                                    })}>
                                {t("btn_remain")}
                                <Typography
                                    fontWeight={700}
                                    component='strong'
                                    mx={1}>{calculRest()}</Typography>
                                {devise}
                            </Button>

                            <Button size='small' variant='contained' color={calculRest() === 0 ? "success" : "warning"}
                                    {...(isMobile && {
                                        fullWidth: true
                                    })}
                                    {...(wallet > 0 && {
                                        sx: {
                                            flexWrap: 'wrap',
                                            ml: {xs: '0 !important', md: '8px !important'},
                                            mt: {xs: '8px !important', md: '0 !important',}
                                        }
                                    })}
                            >
                                {t("total")}
                                <Typography fontWeight={700} component='strong'
                                            mx={1}>{selectedPayment.total}</Typography>
                                {devise}
                            </Button>
                        </Stack>}
                    </Stack>}

                {!patient && <Box>
                    <Typography style={{color: "gray"}} fontSize={12} mb={1}>{t('description')}</Typography>
                    <TextField
                        value={label}
                        style={{width: "100%"}}
                        onChange={(ev) => {
                            setLabel(ev.target.value)
                        }}/>
                    <Typography style={{color: "gray"}} fontSize={12} mb={0} mt={3}>{t('paymentMean')}</Typography>
                </Box>}

                <FormGroup
                    row
                    {...(deals.selected && {
                        sx: {
                            borderBottom: 1,
                            borderColor: 'divider'
                        }
                    })}>
                    {paymentTypesList && paymentTypesList.filter((pt: { slug: string; }) => !(!appointment && pt.slug === "check")).map((method: {
                            slug: any;
                            name: string;
                            logoUrl: { url: string | undefined; };
                        }) =>
                            <FormControlLabel
                                className={method.slug === deals.selected ? "selected" : ''}
                                onClick={() => {
                                    setDeals({...deals, selected: method.slug});
                                    setFieldValue("selected", method.slug)
                                }}
                                key={method.name}
                                control={
                                    <Checkbox checked={values.selected === method.slug} name={t(method.name)}/>
                                }
                                label={
                                    <Stack className='label-inner' direction='row' alignItems="center" spacing={1}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img style={{width: 16}} src={method.logoUrl.url} alt={'payment means'}/>
                                        {
                                            !isMobile && maxLength < 5 &&
                                            <Typography>{t(method.name)}</Typography>
                                        }

                                    </Stack>
                                }
                            />
                    )}

                    {
                        appointment && insurances && patient.insurances.map((insurance: any) =>
                            <FormControlLabel
                                className={insurance.uuid === deals.selected ? "selected" : ''}
                                onClick={() => {
                                    setDeals({...deals, selected: insurance.uuid});
                                    setFieldValue("selected", insurance.uuid)
                                }}
                                key={insurance.insurance.name}
                                control={
                                    <Checkbox checked={values.selected === insurance.uuid}
                                              name={t(insurance.insurance.name)}/>
                                }
                                label={
                                    <Stack className='label-inner' direction='row' alignItems="center" spacing={1}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img style={{width: 16}}
                                             src={insurances.find(i => i.uuid === insurance.insurance.uuid)?.logoUrl.url}
                                             alt={'insurance logo'}/>

                                        {
                                            !isMobile && maxLength < 5 &&
                                            <Typography>{t(insurance.insurance.name)}</Typography>
                                        }

                                    </Stack>
                                }
                            />
                        )
                    }

                    {appointment && wallet > 0 && <FormControlLabel
                        className={deals.selected === "wallet" ? "selected" : ''}
                        onClick={() => {
                            setDeals({...deals, selected: "wallet"});
                            setFieldValue("selected", "wallet")
                        }}
                        control={
                            <Checkbox checked={values.selected === "wallet"}
                                      name={t("wallet")}/>
                        }
                        label={
                            <Stack className='label-inner' direction='row' alignItems="center" spacing={1}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <IconUrl path={'ic-payment'}/>

                                {
                                    !isMobile && maxLength < 5 &&
                                    <Typography>{t("wallet")}</Typography>
                                }

                            </Stack>
                        }
                    />}
                </FormGroup>
                <Grid container alignItems="center">
                    <Grid item xs={12} lg={payments.length > 0 ? 7 : 12}>
                        <AnimatePresence mode='wait'>
                            {(() => {
                                switch (values.selected) {
                                    case 'cash':
                                    case 'online':
                                    case 'promissory_note':
                                    case 'transfert':
                                    case 'card':
                                    case 'credit_card':
                                        return <TabPanel index={0}>
                                            <Stack px={{xs: 2, md: 4}} minHeight={200} justifyContent="center">
                                                <Box width={1}>
                                                    <Typography gutterBottom>
                                                        {t('enter_the_amount')}
                                                    </Typography>
                                                    <Stack direction='row' spacing={2} alignItems="center">
                                                        <TextField
                                                            type='number'
                                                            fullWidth
                                                            {...getFieldProps("cash.amount")}
                                                            error={Boolean(touched.cash && errors.cash)}
                                                        />
                                                        <Typography variant={"body1"}>
                                                            {devise}
                                                        </Typography>
                                                    </Stack>

                                                    <Button color={"success"}
                                                            disabled={(appointment && (values.cash.amount === "" || Number(values.cash?.amount) > calculRest())) || !appointment && values.cash.amount === ""}
                                                            onClick={() => {
                                                                const newPayment = [...payments, {
                                                                    amount: values.cash?.amount,
                                                                    designation: label,
                                                                    payment_date: moment().format('DD-MM-YYYY HH:mm'),
                                                                    status_transaction: TransactionStatus[1].value,
                                                                    type_transaction: TransactionType[2].value,
                                                                    payment_means: paymentTypesList.find((pt: {
                                                                        slug: string;
                                                                    }) => pt.slug === deals.selected)
                                                                }]
                                                                setPayments(newPayment);
                                                                setLabel("");
                                                                resetForm();
                                                                calculRest()
                                                            }}
                                                            sx={{marginTop: 2}}
                                                            startIcon={<AddIcon/>}
                                                            variant={"contained"}>
                                                        <Typography> {t('add')}</Typography>
                                                    </Button>
                                                </Box>
                                            </Stack>
                                        </TabPanel>
                                    case 'check':
                                        return <TabPanel index={0}>
                                            <Stack p={4} minHeight={200} justifyContent="center">
                                                <Typography gutterBottom>
                                                    {t('enter_the_amount')}
                                                </Typography>
                                                <Stack spacing={1}>
                                                    {values.check.map((step: any, idx: number) =>
                                                        <Paper key={idx}>
                                                            <Stack spacing={1} alignItems="flex-start">

                                                                <Stack direction='row' alignItems="center"
                                                                       spacing={1}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        placeholder={t("amount")}
                                                                        {...getFieldProps(`check[${idx}].amount`)}
                                                                        fullWidth
                                                                        type="number"
                                                                        required
                                                                    />
                                                                    <Typography>
                                                                        {devise}
                                                                    </Typography>

                                                                    <TextField
                                                                        variant="outlined"
                                                                        placeholder={t("carrier")}
                                                                        fullWidth
                                                                        type="text"
                                                                        {...getFieldProps(`check[${idx}].carrier`)}
                                                                        required
                                                                    />
                                                                    <TextField
                                                                        variant="outlined"
                                                                        placeholder={t("bank")}
                                                                        fullWidth
                                                                        type="text"
                                                                        {...getFieldProps(`check[${idx}].bank`)}
                                                                        required
                                                                    />
                                                                </Stack>

                                                                <TextField
                                                                    variant="outlined"
                                                                    placeholder={t("check_number")}
                                                                    fullWidth
                                                                    type="number"
                                                                    {...getFieldProps(`check[${idx}].check_number`)}
                                                                    required
                                                                />

                                                                <Grid container alignItems="center">
                                                                    <Grid item xs={12} lg={2}>
                                                                        <Typography color="text.secondary"
                                                                                    variant='body2'
                                                                                    fontWeight={400}>
                                                                            {t("payment_date")}
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={12} lg={10}>
                                                                        <Grid container alignItems='cetner' spacing={1}>
                                                                            <Grid item xs={12} lg={4}>
                                                                                <DatePicker
                                                                                    value={values.check[idx].payment_date}
                                                                                    onChange={(newValue: any) => {
                                                                                        setFieldValue(`check[${idx}].payment_date`, new Date(newValue));
                                                                                    }}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12} lg={8}>
                                                                                <Stack direction={{
                                                                                    xs: 'column',
                                                                                    lg: 'row'
                                                                                }}
                                                                                       alignItems={{
                                                                                           lg: 'center',
                                                                                           xs: 'flex-start'
                                                                                       }}
                                                                                       spacing={{xs: 0, lg: 4}}>
                                                                                    <Typography color="text.secondary"
                                                                                                variant='body2'
                                                                                                fontWeight={400}>
                                                                                        {t("expiry_date")}
                                                                                    </Typography>
                                                                                    <DatePicker
                                                                                        value={values.check[idx].expiry_date}
                                                                                        onChange={(newValue: any) => {
                                                                                            setFieldValue(`check[${idx}].expiry_date`, newValue);
                                                                                        }}
                                                                                    />
                                                                                </Stack>
                                                                            </Grid>
                                                                        </Grid>

                                                                    </Grid>
                                                                </Grid>
                                                            </Stack>
                                                            <Stack alignItems='flex-end' mt={2}>
                                                                {
                                                                    values.check.length > 1 &&
                                                                    <IconButton size="small"
                                                                                onClick={() => handleDeleteStep(step)}>
                                                                        <IconUrl path="setting/icdelete"/>
                                                                    </IconButton>
                                                                }

                                                            </Stack>
                                                        </Paper>
                                                    )}
                                                </Stack>
                                                <Stack direction={"row"} justifyContent="space-between">
                                                    <Button onClick={() => handleAddStep()}
                                                            sx={{alignSelf: "flex-end", mt: 2}}>
                                                        + {t("add_cheque")}
                                                    </Button>

                                                    <Button disabled={checkCheques()}
                                                            onClick={() => {
                                                                let updatedPays: any[] = [];
                                                                values.check?.map((ck: any) => {
                                                                    updatedPays.push({
                                                                        payment_date: moment().format('DD-MM-YYYY HH:mm'),
                                                                        designation: label,
                                                                        status_transaction: TransactionStatus[1].value,
                                                                        type_transaction: TransactionType[2].value,
                                                                        amount: ck.amount,
                                                                        data: ck,
                                                                        payment_means: paymentTypesList.find((pt: {
                                                                            slug: string;
                                                                        }) => pt.slug === deals.selected)
                                                                    });
                                                                });
                                                                setPayments([...payments, ...updatedPays]);
                                                                resetForm();
                                                            }} color="success" variant='contained'
                                                            sx={{alignSelf: "flex-end", mt: 2}}>
                                                        + {t("add")}
                                                    </Button>
                                                </Stack>

                                            </Stack>
                                        </TabPanel>
                                    case 'wallet':
                                        return <TabPanel index={0}>
                                            <Stack px={{xs: 2, md: 4}} minHeight={200} justifyContent="center">
                                                <Box width={1}>
                                                    <Typography gutterBottom>
                                                        {t('enter_the_amount')}
                                                    </Typography>
                                                    <Stack direction='row' spacing={2} alignItems="center">
                                                        <TextField
                                                            type='number'
                                                            fullWidth
                                                            {...getFieldProps("cash.amount")}
                                                            error={Boolean(touched.cash && errors.cash)}
                                                        />
                                                        <Typography variant={"body1"}>
                                                            {devise}
                                                        </Typography>
                                                    </Stack>

                                                    <Button color={"success"}
                                                            disabled={values.cash.amount === "" || Number(values.cash?.amount) > calculRest() || Number(values.cash?.amount) > wallet}
                                                            onClick={() => {
                                                                const newPayment = [...payments, {
                                                                    amount: Number(values.cash?.amount),
                                                                    designation: label,
                                                                    payment_date: moment().format('DD-MM-YYYY HH:mm'),
                                                                    status_transaction: TransactionStatus[1].value,
                                                                    type_transaction: TransactionType[4].value,
                                                                    wallet: true
                                                                }]
                                                                setPayments(newPayment);
                                                                setLabel("");
                                                                resetForm();

                                                                setWallet(wallet - Number(values.cash?.amount));

                                                                setDeals({
                                                                    ...deals,
                                                                    selected: paymentTypesList[0].slug
                                                                });
                                                                setFieldValue("selected", paymentTypesList[0].slug)
                                                                setByRate(false);
                                                            }}
                                                            sx={{marginTop: 2}}
                                                            startIcon={<AddIcon/>}
                                                            variant={"contained"}>
                                                        <Typography> {t('add')}</Typography>
                                                    </Button>
                                                </Box>
                                            </Stack>
                                        </TabPanel>
                                    default:
                                        return <TabPanel index={0}>
                                            <Stack px={{xs: 2, md: 4}} minHeight={200} justifyContent="center">
                                                <Box width={1}>
                                                    <Typography gutterBottom>
                                                        {t('enter_the_amount')}
                                                    </Typography>
                                                    <Stack direction='row' spacing={2} alignItems="center">
                                                        <TextField
                                                            type='number'
                                                            fullWidth
                                                            {...getFieldProps("cash.amount")}
                                                            error={Boolean(touched.cash && errors.cash)}
                                                        />
                                                        <Typography variant={"body1"}>
                                                            {devise}
                                                        </Typography>
                                                    </Stack>

                                                    <Stack mt={1} direction={"row"} justifyContent={"center"}
                                                           alignItems={"center"}>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={byRate} onChange={() => {
                                                                setByRate(!byRate)
                                                            }}/>} label="Par taux"/>
                                                        {byRate &&
                                                            <Stack direction={"row"} spacing={1}
                                                                   justifyContent={"center"}
                                                                   alignItems={"center"}>
                                                                <TextField
                                                                    type='number'
                                                                    onChange={(ev) => {
                                                                        const res = ev.target.value;
                                                                        setFieldValue("cash.amount", Number(selectedPayment.total * Number(res) / 100).toFixed(3))
                                                                    }}
                                                                />
                                                                <Typography variant={"body1"}>
                                                                    %
                                                                </Typography>
                                                            </Stack>}

                                                    </Stack>

                                                    <Button color={"success"}
                                                            disabled={values.cash.amount === "" || Number(values.cash?.amount) > calculRest()}
                                                            onClick={() => {

                                                                const newPayment = [...payments, {
                                                                    amount: Number(values.cash?.amount),
                                                                    designation: label,
                                                                    payment_date: moment().format('DD-MM-YYYY HH:mm'),
                                                                    status_transaction: TransactionStatus[1].value,
                                                                    type_transaction: TransactionType[2].value,
                                                                    insurance: deals.selected//insurances.find(i => i.uuid === deals.selected),
                                                                }]
                                                                setPayments(newPayment);
                                                                setLabel("");

                                                                resetForm();

                                                                setDeals({
                                                                    ...deals,
                                                                    selected: paymentTypesList[0].slug
                                                                });
                                                                setFieldValue("selected", paymentTypesList[0].slug)
                                                                setByRate(false);
                                                            }}
                                                            sx={{marginTop: 2}}
                                                            startIcon={<AddIcon/>}
                                                            variant={"contained"}>
                                                        <Typography> {t('add')}</Typography>
                                                    </Button>
                                                </Box>
                                            </Stack>
                                        </TabPanel>
                                }
                            })()}
                        </AnimatePresence>
                    </Grid>
                    {payments.length > 0 && <Grid item xs={12} lg={5}>
                        <AnimatePresence mode='wait'>

                            <Box ml={1}>
                                <DesktopContainer>
                                    <Otable
                                        {...{t, patient: patient ? patient : null}}
                                        headers={headCells}
                                        rows={payments}
                                        handleEvent={(action: string, payIndex: number) => {
                                            const paymentsUpdated = [...payments];
                                            paymentsUpdated.splice(payIndex, 1);
                                            setPayments(paymentsUpdated);
                                        }}
                                        from={"payment_dialog"}
                                        sx={{tableLayout: 'fixed'}}
                                    />
                                </DesktopContainer>
                                <MobileContainer>
                                    <PaymentDialogMobileCard data={payments} t={t}/>
                                </MobileContainer>
                            </Box>
                        </AnimatePresence>
                    </Grid>
                    }

                </Grid>
            </PaymentDialogStyled>
        </FormikProvider>
    )
}

export default PaymentDialog
