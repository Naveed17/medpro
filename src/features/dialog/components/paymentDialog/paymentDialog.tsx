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
import {Otable} from '@features/table';
import {DatePicker} from "@features/datepicker";
import {AnimatePresence, motion} from 'framer-motion';
import {DesktopContainer} from '@themes/desktopConainter';
import {PaymentDialogMobileCard} from '@features/card';
import {MobileContainer} from '@themes/mobileContainer';
import {useTranslation} from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment-timezone";
import {FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@app/constants";

const PaymentTypes = [
    {
        icon: 'ic-argent',
        label: 'cash'
    },
    {
        icon: 'ic-card',
        label: 'card'
    },
    {
        icon: 'ic-cheque',
        label: 'check'
    },

]

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
    const {patient, selectedPayment, setSelectedPayment, deals, setDeals} = data;

    const {t, ready} = useTranslation("payment");

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const {data: session} = useSession();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const [payments, setPayments] = useState<any>([...selectedPayment.payments]);
    const [label, setLabel] = useState('');

    const validationSchema = Yup.object().shape({
        totalToPay: Yup.number(),
        /*cash: Yup.object().shape({
            amount: Yup.number().integer().lessThan(Yup.ref('totalToPay'), `amount-error ${Yup.ref('totalToPay')}`)
        })*/
    });

    const formik = useFormik({
        initialValues: {
            ...deals,
            totalToPay: selectedPayment.total - selectedPayment.amount
        },
        validationSchema,
        onSubmit: values => {
            console.log(values);
        },
    });

    const {values, errors, touched, getFieldProps, setFieldValue, resetForm} = formik;

    useEffect(() => {
        setSelectedPayment({
            ...selectedPayment,
            payments
        });
    }, [payments]); // eslint-disable-line react-hooks/exhaustive-deps

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

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <FormikProvider value={formik}>
            <PaymentDialogStyled>
                {patient &&
                    <Stack spacing={2}
                       direction={{xs: patient ? 'column' : 'row', md: 'row'}}
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
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <IconUrl path="ic-anniverssaire"/>
                                    <Typography variant='body2' color="text.secondary" alignItems='center'>
                                        {patient.birthdate}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    <Stack
                        direction={{xs: 'column', md: 'row'}}
                        alignItems="center"
                        justifyContent={{xs: 'center', md: 'flex-start'}}
                        sx={{
                            "& .MuiButtonBase-root": {
                                fontWeight: "bold",
                                fontSize: 16
                            }
                        }}
                        spacing={1}>
                        {(selectedPayment && selectedPayment.amount) &&
                            <Button size='small' variant='contained' color="error"
                                    {...(isMobile && {
                                        fullWidth: true
                                    })}
                            >
                                {t("btn_remain")}
                                <Typography
                                    fontWeight={700}
                                    component='strong'
                                    mx={1}>{values.totalToPay}</Typography>
                                {devise}
                            </Button>
                        }

                        <Button size='small' variant='contained' color="warning"
                                {...(isMobile && {
                                    fullWidth: true
                                })}
                        >
                            {t("total")}
                            <Typography fontWeight={700} component='strong'
                                        mx={1}>{selectedPayment ? selectedPayment.total : 0}</Typography>
                            {devise}
                        </Button>
                    </Stack>
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
                    {PaymentTypes.map((method: { icon: string; label: string }) =>
                        <FormControlLabel
                            className={method.label === deals.selected ? "selected" : ''}
                            onClick={() => {
                                deals.selected = method.label
                                setDeals(deals);
                                setFieldValue("selected", method.label)
                            }}
                            key={method.label}
                            control={
                                <Checkbox checked={values.selected === method.label} name={t(method.label)}/>
                            }
                            label={
                                <Stack className='label-inner' direction='row' alignItems="center" spacing={1}>
                                    <IconUrl path={method.icon}/>
                                    {
                                        !isMobile && <Typography>{t(method.label)}</Typography>
                                    }

                                </Stack>
                            }
                        />
                    )}
                </FormGroup>
                <AnimatePresence exitBeforeEnter>
                    {(() => {
                        switch (values.selected) {
                            case 'cash':
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
                                                    disabled={values.cash.amount === ""}
                                                    onClick={() => {
                                                        setPayments([...payments, {
                                                            date: moment().format("DD-MM-YYYY"),
                                                            time: moment().format("HH:mm"),
                                                            patient: patient,
                                                            payment_type: [PaymentTypes[0]],
                                                            amount: values.cash?.amount
                                                        }]);
                                                        resetForm();
                                                    }}
                                                    sx={{marginTop: 2}}
                                                    startIcon={<AddIcon/>}
                                                    variant={"contained"}>
                                                <Typography> {t('add')}</Typography>
                                            </Button>
                                        </Box>
                                    </Stack>
                                </TabPanel>
                            case 'card':
                                return <TabPanel index={1}>
                                    <Stack px={4} minHeight={200} justifyContent="center">
                                        <Box width={1}>
                                            <Typography gutterBottom>
                                                {t('enter_the_amount')}
                                            </Typography>
                                            <Stack direction='row' spacing={2} alignItems="center">
                                                <TextField
                                                    type='number'
                                                    fullWidth
                                                    {...getFieldProps("card.amount")}
                                                    error={Boolean(touched?.card && errors?.card)}
                                                />
                                                <Typography>
                                                    {devise}
                                                </Typography>
                                            </Stack>
                                            <Button color={"success"}
                                                    disabled={values.card.amount === ""}
                                                    onClick={() => {
                                                        setPayments([...payments, {
                                                            date: moment().format("DD-MM-YYYY"),
                                                            time: moment().format("HH:mm"),
                                                            patient: patient,
                                                            payment_type: [PaymentTypes[1]],
                                                            amount: values.card?.amount
                                                        }]);
                                                        resetForm();
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
                                return <TabPanel index={3}>
                                    <Stack p={4} minHeight={200} justifyContent="center">
                                        <Typography gutterBottom>
                                            {t('enter_the_amount')}
                                        </Typography>
                                        <Stack spacing={1}>
                                            {values.check.map((step: any, idx: number) =>
                                                <Paper key={idx}>
                                                    <Stack spacing={1} alignItems="flex-start">
                                                        <Grid container alignItems="center">
                                                            <Grid item xs={12} lg={2}>
                                                                <Typography color="text.secondary" variant='body2'
                                                                            fontWeight={400}>
                                                                    {t("amount")}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} lg={10}>
                                                                <Stack direction='row' alignItems="center" spacing={1}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        placeholder={t("amount")}
                                                                        {...getFieldProps(`check[${idx}].amount`)}
                                                                        fullWidth
                                                                        type="number"
                                                                        required
                                                                    />
                                                                    <Typography>
                                                                        TND
                                                                    </Typography>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container alignItems="center">
                                                            <Grid item xs={12} lg={2}>
                                                                <Typography color="text.secondary" variant='body2'
                                                                            fontWeight={400}>
                                                                    {t("carrier")}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} lg={10}>
                                                                <TextField
                                                                    variant="outlined"
                                                                    placeholder={t("carrier")}
                                                                    fullWidth
                                                                    type="text"
                                                                    {...getFieldProps(`check[${idx}].carrier`)}
                                                                    required
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container alignItems="center">
                                                            <Grid item xs={12} lg={2}>
                                                                <Typography color="text.secondary" variant='body2'
                                                                            fontWeight={400}>
                                                                    {t("bank")}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} lg={10}>
                                                                <TextField
                                                                    variant="outlined"
                                                                    placeholder={t("bank")}
                                                                    fullWidth
                                                                    type="text"
                                                                    {...getFieldProps(`check[${idx}].bank`)}
                                                                    required
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container alignItems="center">
                                                            <Grid item xs={12} lg={2}>
                                                                <Typography color="text.secondary" variant='body2'
                                                                            fontWeight={400}>
                                                                    {t("check_number")}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} lg={10}>
                                                                <TextField
                                                                    variant="outlined"
                                                                    placeholder={t("check_number")}
                                                                    fullWidth
                                                                    type="number"
                                                                    {...getFieldProps(`check[${idx}].check_number`)}
                                                                    required
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container alignItems="center">
                                                            <Grid item xs={12} lg={2}>
                                                                <Typography color="text.secondary" variant='body2'
                                                                            fontWeight={400}>
                                                                    {t("payment_date")}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} lg={10}>
                                                                <Grid container alignItems='cetner' spacing={1}>
                                                                    <Grid item xs={12} lg={4}>
                                                                        <DatePicker
                                                                            {...getFieldProps(`check[${idx}].payment_date`)}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={12} lg={8}>
                                                                        <Stack direction={{xs: 'column', lg: 'row'}}
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
                                                                                {...getFieldProps(`check[${idx}].expiry_date`)}
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

                                            <Button onClick={() => {
                                                let updatedPays: any[] = [];
                                                values.check?.map((ck: any) => {
                                                    updatedPays.push({
                                                        date: moment().format("DD-MM-YYYY"),
                                                        time: moment().format("HH:mm"),
                                                        patient: patient,
                                                        payment_type: [PaymentTypes[2]],
                                                        amount: ck.amount
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
                        }
                    })()}
                </AnimatePresence>
                <AnimatePresence exitBeforeEnter>
                    {payments.length > 0 &&
                        <Box mt={4}>
                            <DesktopContainer>
                                <Otable
                                    {...{t}}
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
                    }
                </AnimatePresence>
            </PaymentDialogStyled>
        </FormikProvider>
    )
}

export default PaymentDialog
