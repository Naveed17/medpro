import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PaymentDialogStyled from "./overrides/paymentDialogStyle";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import {
  DefaultCountry,
  TransactionStatus,
  TransactionType,
} from "@lib/constants";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import AddIcon from "@mui/icons-material/Add";
import { MobileContainer } from "@themes/mobileContainer";
import { PaymentDialogMobileCard } from "@features/card";
import { Otable } from "@features/table";
import { DesktopContainer } from "@themes/desktopConainter";
import moment from "moment-timezone";
import { useAppSelector } from "@lib/redux/hooks";
import { cashBoxSelector } from "@features/leftActionBar/components/cashbox";
import { DatePicker } from "@features/datepicker";
import { useInsurances } from "@lib/hooks/rest";
import { useRequestQuery } from "@lib/axios";
import { filterReasonOptions, useMedicalEntitySuffix } from "@lib/hooks";
import { dashLayoutSelector } from "@features/base";
import { useRouter } from "next/router";
import useBanks from "@lib/hooks/rest/useBanks";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import ConsultationCard from "./consultationCard";
import PaymentCard from "./paymentCard";
const LoadingScreen = dynamic(
  () => import("@features/loadingScreen/components/loadingScreen")
);

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
    id: "time",
    numeric: false,
    disablePadding: true,
    label: "time",
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
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      delay: 0.1,
    },
  },
};

function TabPanel(props: TabPanelProps) {
  const { children, index, ...other } = props;
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

function PaymentDialog({ ...props }) {
  const { data } = props;
  const theme = useTheme<Theme>();
  const { data: session } = useSession();
  const ref = useRef(null);
  const scrollToView = () => {
    setTimeout(() => {
      (ref.current as unknown as HTMLElement)?.scrollIntoView({
        behavior: "smooth",
      });
    }, 300);
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { data: user } = session as Session;
  const { t, ready } = useTranslation("payment");
  const { paymentTypesList } = useAppSelector(cashBoxSelector);
  const { medicalEntityHasUser } = useAppSelector(dashLayoutSelector);

  const { insurances } = useInsurances();
  const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();
  const router = useRouter();

  const { appointment, selectedPayment, setSelectedPayment, patient } = data;
  const { banks } = useBanks();

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const [payments, setPayments] = useState<any>([...selectedPayment.payments]);
  const [label, setLabel] = useState("");
  const [byRate, setByRate] = useState(false);
  const [wallet, setWallet] = useState(0);
  const [deals, setDeals] = React.useState<any>({
    cash: {
      amount:
        selectedPayment.total > 0 && payments.length === 0
          ? selectedPayment.total - selectedPayment.payed_amount
          : 0,
    },
    card: {
      amount:
        selectedPayment.total > 0 && payments.length === 0
          ? selectedPayment.total - selectedPayment.payed_amount
          : 0,
    },
    check: [
      {
        amount:
          selectedPayment.total > 0 && payments.length === 0
            ? selectedPayment.total - selectedPayment.payed_amount
            : 0,
        carrier: patient ? `${patient.firstName} ${patient.lastName}` : "",
        bank: "",
        check_number: "",
        payment_date: new Date(),
        expiry_date: new Date(),
      },
    ],
    selected:
      paymentTypesList && paymentTypesList.length > 0
        ? paymentTypesList[0].slug
        : null,
  });

  const medical_entity = (user as UserDataResponse)
    .medical_entity as MedicalEntityModel;
  const doctor_country = medical_entity.country
    ? medical_entity.country
    : DefaultCountry;
  const devise = doctor_country.currency?.name;
  const maxLength =
    patient && patient.insurances
      ? patient.insurances.length + paymentTypesList.length
      : 1;

  const validationSchema = Yup.object().shape({
    totalToPay: Yup.number(),
  });

  const formik = useFormik({
    initialValues: {
      ...deals,
      totalToPay: selectedPayment.total - selectedPayment.payed_amount,
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

  const { values, errors, touched, getFieldProps, setFieldValue, resetForm } =
    formik;

  const { data: httpPatientWallet } = useRequestQuery(
    medicalEntityHasUser && appointment
      ? {
          method: "GET",
          url: `${urlMedicalEntitySuffix}/mehu/${
            (medicalEntityHasUser[0] as any)?.slug
          }/patients/${patient?.uuid}/wallet/${router.locale}`,
        }
      : null
  );

  const handleAddStep = () => {
    const step = [
      ...values.check,
      {
        amount: "",
        carrier: "",
        bank: "",
        check_number: "",
        payment_date: new Date(),
        expiry_date: new Date(),
      },
    ];
    setFieldValue("check", step);
  };
  const handleChangePayment = (props: string) => {
    setFieldValue("paymentMethods", [
      ...values.paymentMethods,
      {
        selected: props,
        cash: {
          amount: 0,
        },
        check: [
          {
            amount: "",
            carrier: "",
            bank: "",
            check_number: "",
            payment_date: new Date(),
            expiry_date: new Date(),
          },
        ],
      },
    ]);
    scrollToView();
    handleClose();
  };
  const handleDeleteStep = (props: any) => {
    const filter = values.check.filter((item: any) => item !== props);
    setFieldValue("check", filter);
  };

  const calculInsurance = () => {
    let total = 0;
    payments.map((pay: { insurance: string; amount: number }) => {
      if (pay.insurance) total += pay.amount;
    });
    return total;
  };

  const checkCheques = () => {
    if (selectedPayment.uuid !== "") {
      let total = 0;
      let hasEmpty = false;
      values.check.map((check: { amount: number }) => {
        if (check.amount.toString() === "") hasEmpty = true;
        else total += check.amount;
      });
      return hasEmpty ? hasEmpty : total > calculRest();
    } else {
      let hasEmpty = false;
      let total = 0;
      values.check.map((check: { amount: number }) => {
        if (check.amount.toString() === "") hasEmpty = true;
        else total += check.amount;
      });
      return hasEmpty;
    }
  };

  const calculRest = () => {
    let paymentTotal = 0;
    selectedPayment.payments.map(
      (pay: { amount: number }) => (paymentTotal += pay.amount)
    );
    return selectedPayment.total - paymentTotal;
  };

  const getHours = () => {
    return `${new Date().getHours()}:${new Date().getMinutes()}`;
  };
  useEffect(() => {
    setSelectedPayment({
      ...selectedPayment,
      payments,
    });
  }, [payments]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (httpPatientWallet) {
      const w = (httpPatientWallet as HttpResponse).data.wallet;
      setWallet(w);
    }
  }, [httpPatientWallet]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return <LoadingScreen button text={"loading-error"} />;

  return (
    <FormikProvider value={formik}>
      <PaymentDialogStyled>
        {patient && (
          <Stack
            spacing={2}
            direction={{ xs: patient ? "column" : "row", sm: "row" }}
            alignItems="center"
            justifyContent={patient ? "space-between" : "flex-end"}
            mb={2}
          >
            <Stack spacing={2} direction="row" alignItems="center">
              <Avatar
                sx={{ width: 42, height: 42 }}
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
                    <IconUrl path="ic-tel" color={theme.palette.text.primary} />
                    <Typography variant="body2" alignItems="center">
                      {patient.contact[0]}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Stack>

            {appointment && (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems="center"
                justifyContent={{ xs: "center", sm: "flex-start" }}
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
                </Button>

                <Button
                  size="small"
                  variant="contained"
                  color={calculRest() === 0 ? "success" : "error"}
                  {...(isMobile && {
                    fullWidth: true,
                  })}
                >
                  {t("btn_remain")}
                  <Typography fontWeight={700} component="strong" mx={1}>
                    {calculRest().toFixed(3)}
                  </Typography>
                  {devise}
                </Button>

                <Button
                  size="small"
                  variant="contained"
                  color={calculRest() === 0 ? "success" : "warning"}
                  {...(isMobile && {
                    fullWidth: true,
                  })}
                  {...(wallet > 0 && {
                    sx: {
                      flexWrap: "wrap",
                      ml: { xs: "0 !important", md: "8px !important" },
                      mt: { xs: "8px !important", md: "0 !important" },
                    },
                  })}
                >
                  {t("total")}
                  <Typography fontWeight={700} component="strong" mx={1}>
                    {selectedPayment.total}
                  </Typography>
                  {devise}
                </Button>
              </Stack>
            )}
          </Stack>
        )}

        {/* {!patient && <Box>
                    <Typography style={{color: "gray"}} fontSize={12} mb={1}>{t('description')}</Typography>
                    <TextField
                        value={label}
                        style={{width: "100%"}}
                        onChange={(ev) => {
                            setLabel(ev.target.value)
                        }}/>
                    <Typography style={{color: "gray"}} fontSize={12} mb={0} mt={3}>{t('paymentMean')}</Typography>
                </Box>} */}

        {/* <FormGroup
                    row
                    {...(deals.selected && {
                        sx: {
                            borderBottom: 1,
                            borderColor: 'divider'
                        }

                    })}
                    {...(isMobile && {
                        sx: {
                            gridTemplateColumns: `repeat(${paymentTypesList.length + patient.insurances.length + (wallet > 0 ? 1 : 0)}, minmax(0, 1fr))`,
                            "& .MuiCheckbox-root": {
                                width: 24,
                                height: 24,
                                marginRight: .5
                            },
                            "& .label-inner": {
                                ...((paymentTypesList.length + patient.insurances.length + (wallet > 0 ? 1 : 0)) < 4 && {

                                    position: 'absolute',
                                    left: '50%',
                                    top: "50%",
                                    transform: 'translate(-50%,-50%)',
                                })
                            }
                        }

                    })}
                >
                    {paymentTypesList && paymentTypesList.filter((pt: {
                        slug: string;
                    }) => !(!appointment && pt.slug === "check")).map((method: {
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
                               
                                <IconUrl path={'ic-payment'}/>

                                {
                                    !isMobile && maxLength < 5 &&
                                    <Typography>{t("wallet")}</Typography>
                                }

                            </Stack>
                        }
                    />}
                </FormGroup> */}
        {/* <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={12} lg={payments.length > 0 ? 7 : 12}>
                        <AnimatePresence>
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
                                                                    payment_date: moment(new Date(),'DD-MM-YYYY HH:mm').format('DD-MM-YYYY'),
                                                                    payment_time: getHours(),
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
                                            <Stack p={{xs: 1, sm: 2}} justifyContent="center">
                                                <Typography gutterBottom>
                                                    {t('enter_the_amount')}
                                                </Typography>
                                                <Stack spacing={1}>
                                                    {values.check.map((step: any, idx: number) =>
                                                        <Paper key={idx}>
                                                            <Stack spacing={1} alignItems="flex-start">

                                                                <Stack direction='row' alignItems="center"
                                                                       spacing={1} width={{xs: 1, sm: '100%'}}>
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
                                                                </Stack>
                                                                <Stack width={{xs: 1, sm: '100%'}}
                                                                       direction={{xs: 'column', sm: 'row'}}
                                                                       alignItems="center"
                                                                       spacing={1}>

                                                                    <TextField
                                                                        variant="outlined"
                                                                        placeholder={t("carrier")}
                                                                        fullWidth
                                                                        type="text"
                                                                        {...getFieldProps(`check[${idx}].carrier`)}
                                                                        required
                                                                    />

                                                                    <Autocomplete
                                                                        id={"banks"}
                                                                        freeSolo
                                                                        fullWidth
                                                                        autoHighlight
                                                                        disableClearable
                                                                        placeholder={t("bank")}
                                                                        size="small"
                                                                        value={values[`check[${idx}].bank`]}
                                                                        onChange={(e, newValue: any) => {
                                                                            e.stopPropagation();
                                                                            let res: string
                                                                            if (newValue.inputValue)
                                                                                res = newValue.inputValue
                                                                            else res = newValue.name
                                                                            setFieldValue(`check[${idx}].bank`, res)
                                                                        }}
                                                                        filterOptions={(options, params) => filterReasonOptions(options, params, t)}
                                                                        sx={{color: "text.secondary"}}
                                                                        options={banks ? banks : []}
                                                                        loading={banks?.length === 0}
                                                                        getOptionLabel={(option) => {
                                                                            return option.name;
                                                                        }}
                                                                        isOptionEqualToValue={(option: any, value) => option.name === value?.name}
                                                                        renderOption={(props, option) => (
                                                                            <Stack
                                                                                key={option.uuid ? option.uuid : "-1"}>
                                                                                {!option.uuid && <Divider/>}
                                                                                <MenuItem
                                                                                    {...props}
                                                                                    value={option.uuid}>
                                                                                    {!option.uuid && <AddOutlinedIcon/>}
                                                                                    {option.name}
                                                                                </MenuItem>
                                                                            </Stack>
                                                                        )}
                                                                        renderInput={params => <TextField color={"info"}
                                                                                                          {...params}
                                                                                                          placeholder={"--"}
                                                                                                          sx={{paddingLeft: 0}}
                                                                                                          variant="outlined"
                                                                                                          fullWidth/>}/>

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
                                                                        payment_date: moment(new Date(),'DD-MM-YYYY HH:mm').format('DD-MM-YYYY'),
                                                                        payment_time: getHours(),
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
                                                                    payment_date: moment(new Date(),'DD-MM-YYYY HH:mm').format('DD-MM-YYYY'),
                                                                    payment_time: getHours(),
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
                                                                    payment_date: moment(new Date(),'DD-MM-YYYY HH:mm').format('DD-MM-YYYY'),
                                                                    payment_time: getHours(),
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
                    {
                        payments.length > 0 && <Grid item xs={12} lg={5}>
                            <AnimatePresence>
                                <Box mt={1}>
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
                                        <Stack spacing={2}>
                                            {
                                                payments.map((item: any, i: number) =>
                                                    <React.Fragment key={i}>
                                                        <PaymentDialogMobileCard data={item} t={t}
                                                                                 handleEvent={(action: string, payIndex: number) => {
                                                                                     const paymentsUpdated = [...payments];
                                                                                     paymentsUpdated.splice(payIndex, 1);
                                                                                     setPayments(paymentsUpdated);
                                                                                 }}
                                                                                 index={i}
                                                                                 patient={patient ? patient : null}
                                                        />
                                                    </React.Fragment>
                                                )
                                            }

                                        </Stack>

                                    </MobileContainer>
                                </Box>
                            </AnimatePresence>
                        </Grid>
                    }
                </Grid> */}

        <Grid container spacing={{ xs: 2, md: 6 }}>
          <Grid item xs={12} sm={6}>
            <Typography fontWeight={600} mb={1}>
              {t("current_consultation")}
            </Typography>
            <Stack spacing={1}>
              <ConsultationCard {...{ t, devise }} />
            </Stack>
            <Typography my={1} fontWeight={700}>
              {t("other_consultation")}
            </Typography>
            <Stack
              spacing={1}
              borderRadius={0.5}
              maxHeight={244}
              p={1}
              sx={{ overflowY: "auto", bgcolor: theme.palette.back.main }}
            >
              <ConsultationCard {...{ t, devise }} />
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
                  display: { xs: "none", md: "block" },
                }}
              />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography fontWeight={600} mb={1}>
                  {t("payment")}
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  endIcon={<UnfoldMoreRoundedIcon />}
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
                          style={{ width: 16 }}
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
                          style={{ width: 16 }}
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
                  {values.paymentMethods.map((item: any, i: any) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PaymentCard
                        {...{
                          t,
                          devise,
                          paymentTypesList,
                          item,
                          i,
                          formik,
                          wallet,
                        }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                <Box ref={ref} />
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </PaymentDialogStyled>
    </FormikProvider>
  );
}

export default PaymentDialog;
