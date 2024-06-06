import {
    Box,
    Button,
    Card,
    CardContent,
    InputAdornment,
    LinearProgress,
    Stack,
    TextField,
    Theme,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import React, {useState} from "react";
import PanelStyled from "./overrides/panelStyle";
import {useTranslation} from "next-i18next";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useAppSelector} from "@lib/redux/hooks";
import {useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import {configSelector, dashLayoutSelector} from "@features/base";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import IconUrl from "@themes/urlIcon";
import moment from "moment-timezone";
import CloseIcon from "@mui/icons-material/Close";
import {NoDataCard, TransactionMobileCard} from "@features/card";
import {Dialog} from "@features/dialog";
import {LoadingButton} from "@mui/lab";
import Can from "@features/casl/can";
import {useCashBox} from "@lib/hooks/rest";
import {CustomIconButton} from "@features/buttons";
import Image from "next/image";

function TransactionPanel({...props}) {
    const {patient, rest, wallet, walletMutate, devise, router} = props;
    const theme: Theme = useTheme();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: invalidateQueries} = useInvalidateQueries();
    const {cashboxes} = useCashBox();

    const {t} = useTranslation(["payment", "common"]);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {selectedBoxes} = useAppSelector(cashBoxSelector);
    const {direction} = useAppSelector(configSelector);

    const [transaction_data, setTransaction_data] = useState<any[]>([]);
    const [transaction_loading, setTransaction_loading] = useState<boolean>(false);
    const [loadingDeleteTransaction, setLoadingDeleteTransaction] = useState(false);
    const [loadingDeleteTransactionData, setLoadingDeleteTransactionData] = useState(false);
    const [openDeleteTransactionDialog, setOpenDeleteTransactionDialog] = useState(false);
    const [openDeleteTransactionData, setOpenDeleteTransactionData] = useState(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
    const [selected, setSelected] = useState<any>(null);
    const [selectedData, setSelectedData] = useState<any>(null);
    const [collapse, setCollapse] = useState<any>(null);
    const [state, setState] = useState<any>();
    const [openDialog, setOpenDialog] = useState<boolean>(false);


    const {trigger} = useRequestQueryMutation("/payment/cashbox");

    const variants = {
        open: {height: "auto", opacity: 1},
        closed: {height: 0, opacity: 0},
    };

    const mutatePatientWallet = () => {
        medicalEntityHasUser &&
        selected.appointment &&
        invalidateQueries([
            `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${selected.appointment.patient?.uuid}/wallet/${router.locale}`,
        ]);
    };

    const {data: paymentMeansHttp} = useRequestQuery({
        method: "GET",
        url: `/api/public/payment-means/${router.locale}`,
    }, ReactQueryNoValidateConfig);

    const {
        data: httpTransactionsResponse,
        mutate: mutateTransactions,
        isLoading: isTransactionsLoading
    } = useRequestQuery(patient && cashboxes.length > 0 && selectedBoxes.length > 0 ? {
            method: "GET",
            url: `${urlMedicalEntitySuffix}/transactions/${router.locale}`,
        } : null, {
            keepPreviousData: true,
            ...((patient && cashboxes.length > 0 && selectedBoxes.length > 0) && {
                variables: {
                    query: `?cashboxes=${selectedBoxes[0].uuid}&patient=${patient.uuid}`,
                },
            })
        }
    );
    const pmList = (paymentMeansHttp as HttpResponse)?.data ?? [];

    const rows = (httpTransactionsResponse as HttpResponse)?.data?.transactions ?? [];

    const selectedRow = (uuid: string) => {
        setTransaction_data([]);
        setTransaction_loading(true);
        trigger({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/transactions/${uuid}/transaction-data/${router.locale}`,
            },
            {
                onSuccess: (res) => {
                    setTransaction_data(res.data.data);
                    setTransaction_loading(false);
                },
            }
        );
    };

    const deleteTransaction = () => {
        const form = new FormData();
        form.append("cash_box", selectedBoxes[0]?.uuid);

        trigger({
                method: "DELETE",
                url: `${urlMedicalEntitySuffix}/transactions/${selected?.uuid}/${router.locale}`,
                data: form,
            },
            {
                onSuccess: () => {
                    mutateTransactions();
                    mutatePatientWallet();
                    walletMutate && walletMutate();
                    setLoadingDeleteTransaction(false);
                    setOpenDeleteTransactionDialog(false);
                },
            }
        );
    };

    const deleteTransactionData = () => {
        const form = new FormData();
        form.append("cash_box", selectedBoxes[0]?.uuid);

        trigger({
                method: "DELETE",
                url: `${urlMedicalEntitySuffix}/transactions/${selected?.uuid}/transaction-data/${selectedData.uuid}/${router.locale}`,
                data: form,
            },
            {
                onSuccess: () => {
                    mutateTransactions();
                    mutatePatientWallet();
                    walletMutate && walletMutate();
                    setLoadingDeleteTransactionData(false);
                    setOpenDeleteTransactionData(false);
                    setCollapse(null)
                },
            }
        );
    };

    const handleCloseDialog = () => {
        setOpenDialog(false)
    }

    return (
        <>
            {/* <Stack direction={"row"} justifyContent={"end"} p={1} spacing={1}>
                <div onClick={() => setOpenPaymentDialog(true)}>
                    <Label variant='filled'
                        sx={{ color: theme.palette.success.main, background: theme.palette.success.lighter }}>
                        <span>{t('wallet')}</span>
                        <span style={{
                            fontSize: 14,
                            marginLeft: 5,
                            marginRight: 5,
                            fontWeight: "bold"
                        }}>{wallet}</span>
                        <span>{devise}</span>
                    </Label>
                </div>

                <div onClick={() => setOpenPaymentDialog(true)}>
                    <Label variant='filled'
                        sx={{ color: theme.palette.error.main, background: theme.palette.error.lighter }}>
                        <span style={{ fontSize: 11 }}>{t('credit')}</span>
                        <span style={{
                            fontSize: 14,
                            marginLeft: 5,
                            marginRight: 5,
                            fontWeight: "bold"
                        }}>{rest}</span>
                        <span>{devise}</span>
                    </Label>
                </div>
            </Stack> */}

            <PanelStyled>
                <Box>
                    <CardContent>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            pb={1.2}
                            mb={1.2}>
                            <Typography fontWeight={600} variant="subtitle2"
                                        fontSize={18}>{t("transactions")}</Typography>
                            <Can I={"manage"} a={"cashbox"} field={"cash_box__transaction__create"}>
                                <CustomIconButton onClick={() => setOpenPaymentDialog(true)} color="primary">
                                    <IconUrl path="ic-plus" color={theme.palette.common.white} width={16} height={16}/>
                                </CustomIconButton>
                            </Can>
                        </Stack>
                        <Stack mt={1} mb={3} direction='row' spacing={1} width={1}>
                            <TextField
                                placeholder={t("search")}
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                        <IconUrl path="ic-search"/>
                                    </InputAdornment>,
                                }}/>
                            <CustomIconButton>
                                <IconUrl path="ic-outline-filter"/>
                            </CustomIconButton>
                        </Stack>
                        <LinearProgress
                            sx={{
                                mt: -1.2,
                                visibility: isTransactionsLoading ? "visible" : "hidden"
                            }} color={"warning"}/>

                        {/* {rows.length > 0 && (
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Box width={50} />
                                <table className="payment-table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th align="left">{t("date_time")}</th>
                                            <th>{t("payment_method")}</th>
                                            <th align="left">{t("used")}</th>
                                            <th align="left">{t("amount")}</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows?.map((row: any) => (
                                            <React.Fragment key={row.uuid}>
                                                <tr
                                                    className={`payment-table-row ${row.uuid === collapse ? "row-collapse" : ""
                                                        }`}
                                                    key={row.uuid}
                                                    onClick={() => {
                                                        setCollapse(
                                                            collapse === row.uuid ? null : row.uuid
                                                        );
                                                        selectedRow(row.uuid);
                                                    }}>
                                                    <td>
                                                        <Stack
                                                            direction={{ xs: "column", sm: "row" }}
                                                            alignItems={{ xs: "start", sm: "center" }}
                                                            spacing={0.5}>
                                                            <Stack
                                                                direction="row"
                                                                alignItems="center"
                                                                spacing={0.5}>
                                                                <IconUrl
                                                                    path="ic-agenda"
                                                                    width={12}
                                                                    height={12}
                                                                    color={theme.palette.text.primary}
                                                                />
                                                                <Typography variant="body2">
                                                                    {moment(row.date_transaction).format(
                                                                        "DD/MM/YYYY"
                                                                    )}
                                                                </Typography>
                                                            </Stack>
                                                            <Stack
                                                                direction="row"
                                                                alignItems="center"
                                                                spacing={0.5}>
                                                                <IconUrl path="ic-time" />
                                                                <Typography variant="body2">
                                                                    {row.payment_time}
                                                                </Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </td>
                                                    <td>
                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                            spacing={1}>
                                                            {row.payment_means &&
                                                                row.payment_means.map((mean: any) => (
                                                                    <Tooltip
                                                                        key={mean.slug}
                                                                        title={`${mean.amount} ${devise}`}>

                                                                        <img
                                                                            style={{ width: 15 }}
                                                                            key={mean.slug}
                                                                            src={
                                                                                pmList.find(
                                                                                    (pm: { slug: string }) =>
                                                                                        pm.slug == mean.paymentMeans.slug
                                                                                )?.logoUrl.url
                                                                            }
                                                                            alt={"payment means icon"}
                                                                        />
                                                                    </Tooltip>
                                                                ))}
                                                        </Stack>
                                                    </td>
                                                    <td>
                                                        <Typography fontWeight={700} color="secondary">
                                                            {row.amount - row.rest_amount} {devise}
                                                        </Typography>
                                                    </td>
                                                    <td>
                                                        <Typography fontWeight={700} color="secondary">
                                                            {row.amount} {devise}
                                                        </Typography>
                                                    </td>
                                                    <td>
                                                        {row.uuid === collapse &&
                                                            <Can I={"manage"} a={"cashbox"}
                                                                field={"cash_box__transaction__delete"}>
                                                                <Stack direction={"row"} spacing={1}>
                                                                    <IconButton
                                                                        className="btn-del"
                                                                        onClick={(event) => {
                                                                            event.stopPropagation();
                                                                            console.log(row)
                                                                            setState({
                                                                                type: "payment_receipt",
                                                                                name: "reception",
                                                                                info: row,
                                                                                createdAt: moment().format("DD/MM/YYYY"),
                                                                                age: row.patient?.birthdate ? getBirthdayFormat({ birthdate: row.patient.birthdate }, t) : "",
                                                                                patient: `${row.patient?.firstName} ${row.patient?.lastName}`,
                                                                            });
                                                                            setOpenDialog(true);
                                                                        }}>
                                                                        <IconUrl width={20} height={20}
                                                                            path="menu/ic-print"
                                                                            color={theme.palette.secondary.main} />
                                                                    </IconButton>

                                                                    <IconButton
                                                                        className="btn-del"
                                                                        onClick={(event) => {
                                                                            event.stopPropagation();
                                                                            setSelected(row);
                                                                            setOpenDeleteTransactionDialog(true);
                                                                        }}>
                                                                        <IconUrl
                                                                            path="ic-delete"
                                                                            color={theme.palette.secondary.main}
                                                                        />
                                                                    </IconButton>
                                                                </Stack>
                                                            </Can>}
                                                    </td>
                                                </tr>

                                                {row.uuid === collapse && (
                                                    <motion.tr
                                                        key={row.uuid}
                                                        animate={
                                                            collapse === row.uuid ? "open" : "closed"
                                                        }
                                                        variants={variants}
                                                        initial="closed"
                                                        transition={{ duration: 0.3 }}
                                                        exit={{ opacity: 0, height: 0 }}>
                                                        <td colSpan={6}>
                                                            <Stack
                                                                spacing={1.2}
                                                                mt={-1.2}
                                                                ml={0.2}
                                                                mr={-0.05}
                                                                className="collapse-wrapper"
                                                                {...(transaction_data.length < 1 && {
                                                                    sx: {
                                                                        "&:before": {
                                                                            display: "none",
                                                                        },
                                                                    },
                                                                })}>
                                                                <Paper className="means-wrapper">
                                                                    <Stack spacing={0.5}>
                                                                        {row?.payment_means?.length > 0 &&
                                                                            row.payment_means.map((item: any) => (
                                                                                <Stack direction="row"
                                                                                    alignItems="center"
                                                                                    justifyContent="space-between"
                                                                                    width={1} key={item.uuid}>
                                                                                    <Stack direction="row"
                                                                                        alignItems="center"
                                                                                        spacing={4} width={1}
                                                                                        sx={{ flex: 1 }}>
                                                                                        <Stack direction="row"
                                                                                            alignItems="center"
                                                                                            spacing={1}>
                                                                                            <Tooltip
                                                                                                title={`${item.amount} ${devise}`}>

                                                                                                <img style={{ width: 15 }}
                                                                                                    src={pmList.find((pm: {
                                                                                                        slug: string;
                                                                                                    }) => pm.slug == item?.paymentMeans?.slug)?.logoUrl.url}
                                                                                                    alt={"payment means icon"}
                                                                                                />
                                                                                            </Tooltip>
                                                                                            <Typography
                                                                                                variant="body2">{item?.paymentMeans?.name || ""}</Typography>
                                                                                        </Stack>
                                                                                        <Typography variant="body2"
                                                                                            width={1}>{item?.data?.bank?.abbreviation}</Typography>
                                                                                        <Typography variant="body2"
                                                                                            width={1}>{item?.data?.nb ? ` N° ${item?.data?.nb}` : ""}</Typography>
                                                                                    </Stack>
                                                                                    <Stack
                                                                                        sx={{ flex: 1 }}
                                                                                        direction="row"
                                                                                        alignItems="center"
                                                                                        spacing={4}
                                                                                        width={1}>
                                                                                        <Typography
                                                                                            variant="body2"
                                                                                            width={1}
                                                                                            className="ellipsis">
                                                                                            {item?.data?.carrier}
                                                                                        </Typography>
                                                                                        <Stack
                                                                                            direction="row"
                                                                                            alignItems="center"
                                                                                            spacing={0.5}
                                                                                            width={1}>
                                                                                            <IconUrl
                                                                                                path="ic-agenda"
                                                                                                width={12}
                                                                                                height={12}
                                                                                                color={
                                                                                                    theme.palette.text.primary
                                                                                                }
                                                                                            />
                                                                                            <Typography variant="body2">
                                                                                                {moment(
                                                                                                    item?.data?.date
                                                                                                ).format("DD/MM/YYYY")}
                                                                                            </Typography>
                                                                                        </Stack>
                                                                                        <Typography
                                                                                            variant="body2"
                                                                                            width={1}>
                                                                                            {item.amount ? (<>{item.amount} {devise}</>) : ""}
                                                                                        </Typography>
                                                                                    </Stack>
                                                                                </Stack>
                                                                            ))}
                                                                    </Stack>
                                                                </Paper>
                                                                {transaction_loading && <LinearProgress />}
                                                                {transaction_data.length > 0 &&
                                                                    transaction_data.map((transaction) => (
                                                                        <Card
                                                                            className="consultation-card"
                                                                            key={transaction.uuid}>
                                                                            <CardContent>
                                                                                <Stack
                                                                                    direction="row"
                                                                                    justifyContent="space-between"
                                                                                    alignItems="center">
                                                                                    <Stack
                                                                                        spacing={1}
                                                                                        width={1}
                                                                                        alignItems="center"
                                                                                        direction="row">
                                                                                        <Typography
                                                                                            onClick={() => {
                                                                                                const slugConsultation = `/dashboard/consultation/${transaction?.appointment.uuid}`;
                                                                                                if (router.asPath !== slugConsultation) {
                                                                                                    router.replace(slugConsultation, slugConsultation, { locale: router.locale });
                                                                                                }
                                                                                            }}
                                                                                            sx={{
                                                                                                cursor: "pointer"
                                                                                            }}
                                                                                            fontWeight={700}
                                                                                            minWidth={95}>
                                                                                            {transaction?.appointment?.type?.name}
                                                                                        </Typography>
                                                                                        <Stack
                                                                                            direction="row"
                                                                                            alignItems="center"
                                                                                            spacing={0.5}>
                                                                                            <IconUrl
                                                                                                path="ic-agenda"
                                                                                                width={12}
                                                                                                height={12}
                                                                                                color={
                                                                                                    theme.palette.text.primary
                                                                                                }
                                                                                            />
                                                                                            <Typography variant="body2">
                                                                                                {transaction?.appointment?.dayDate}
                                                                                            </Typography>
                                                                                            <IconUrl path="ic-time" />
                                                                                            <Typography variant="body2">
                                                                                                {transaction?.appointment?.startTime}
                                                                                            </Typography>
                                                                                        </Stack>
                                                                                    </Stack>
                                                                                    <Stack
                                                                                        spacing={1}
                                                                                        width={1}
                                                                                        alignItems="center"
                                                                                        direction="row"
                                                                                        justifyContent="flex-end"
                                                                                        sx={{
                                                                                            span: {
                                                                                                fontSize: 14,
                                                                                                strong: {
                                                                                                    mx: 0.5,
                                                                                                },
                                                                                            },
                                                                                        }}>
                                                                                        <Label
                                                                                            variant="filled"
                                                                                            color={
                                                                                                transaction?.amount ===
                                                                                                    transaction?.amount
                                                                                                        ?.restAmount
                                                                                                    ? "error"
                                                                                                    : "success"
                                                                                            }>
                                                                                            {t("total")}
                                                                                            <strong>
                                                                                                {transaction?.amount}
                                                                                            </strong>
                                                                                            {devise}
                                                                                        </Label>
                                                                                        <Can I={"manage"} a={"cashbox"}
                                                                                            field={"cash_box__transaction__data_delete"}>
                                                                                            <IconButton
                                                                                                className="btn-del"
                                                                                                onClick={(event) => {
                                                                                                    event.stopPropagation();
                                                                                                    setSelectedData(transaction)
                                                                                                    setSelected(row);
                                                                                                    setOpenDeleteTransactionData(true);
                                                                                                }}>
                                                                                                <IconUrl
                                                                                                    path="ic-delete"
                                                                                                    color={theme.palette.secondary.main}
                                                                                                />
                                                                                            </IconButton>
                                                                                        </Can>
                                                                                    </Stack>
                                                                                </Stack>
                                                                            </CardContent>
                                                                        </Card>
                                                                    ))}
                                                            </Stack>
                                                        </td>
                                                    </motion.tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </Stack>
                        )} */}
                        {rows.length > 0 && (
                            <Stack spacing={1}>
                                {rows.map((row: any, idx: number) =>
                                    <Card key={idx} sx={{boxShadow: 'none', border: 1, borderColor: "divider"}}>
                                        <CardContent>
                                            <Stack direction='row' flexWrap={{xs: 'wrap', sm: 'nowrap'}}
                                                   alignItems='flex-start' justifyContent='space-between'
                                                   spacing={{xs: 0, sm: 1}}>
                                                <Stack sx={{width: {xs: '50%', sm: 'auto'}}}>
                                                    <Typography gutterBottom variant="caption"
                                                                color="text.secondary">{t("date_time", {ns: 'payment'})}</Typography>
                                                    <Stack direction={{xs: 'column', sm: 'row'}}
                                                           alignItems={{xs: 'flex-start', sm: 'center'}} spacing={.5}>
                                                        <Stack direction='row' alignItems='center' spacing={.5}>
                                                            <IconUrl path="ic-agenda-jour" width={16} height={16}/>
                                                            <Typography fontWeight={500}>
                                                                {moment(row.date_transaction).format(
                                                                    "DD/MM/YYYY"
                                                                )}
                                                            </Typography>
                                                        </Stack>
                                                        <Stack direction='row' alignItems='center' spacing={.5}>
                                                            <IconUrl path="ic-time"/>
                                                            <Typography fontWeight={500}>
                                                                {row.payment_time}
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                                <Stack sx={{width: {xs: '50%', sm: 'auto'}}}>
                                                    <Typography gutterBottom variant="caption"
                                                                color="text.secondary">{t("payment_method")}</Typography>
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        spacing={1}>
                                                        {row.payment_means && row.payment_means.length ?
                                                            row.payment_means.map((mean: any) => (
                                                                <Tooltip
                                                                    key={mean.slug}
                                                                    title={`${mean.amount} ${devise}`}>
                                                                    <CustomIconButton size="small" color="primary" sx={{
                                                                        p: 1,
                                                                        bgcolor: theme.palette.primary.lighter
                                                                    }}>
                                                                        <Image
                                                                            style={{width: 15}}
                                                                            key={mean.slug}
                                                                            src={
                                                                                pmList.find(
                                                                                    (pm: { slug: string }) =>
                                                                                        pm.slug == mean.paymentMeans.slug
                                                                                )?.logoUrl.url
                                                                            }
                                                                            alt={"payment means icon"}
                                                                        />
                                                                    </CustomIconButton>
                                                                </Tooltip>
                                                            )) : <>--</>}
                                                    </Stack>
                                                </Stack>
                                                <Stack sx={{width: {xs: '50%', sm: 'auto'}}}>
                                                    <Typography gutterBottom variant="caption"
                                                                color="text.secondary">{t("used")}</Typography>
                                                    <Typography fontWeight={500}>
                                                        {row.amount - row.rest_amount} {devise}
                                                    </Typography>

                                                </Stack>
                                                <Stack sx={{width: {xs: '50%', sm: 'auto'}}}>
                                                    <Typography gutterBottom variant="caption"
                                                                color="text.secondary">{t("amount")}</Typography>
                                                    <Typography fontWeight={500}>
                                                        {row.amount} {devise}
                                                    </Typography>

                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                )}
                            </Stack>
                        )}
                        {
                            rows && rows.length === 0 && <NoDataCard t={t} ns={"payment"} data={{
                                mainIcon: "ic-argent",
                                title: "noTransaction",
                                description: "addTransaction"
                            }}/>
                        }

                    </CardContent>
                </Box>
            </PanelStyled>
            <Box display={"none"} px={1}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    borderBottom={1}
                    borderColor="divider"
                    pb={1.2}
                    mb={1.2}>
                    <Typography fontWeight={600}>{t("transactions")}</Typography>
                    <Button startIcon={<IconUrl path="ic-argent"/>}
                            onClick={() => setOpenPaymentDialog(true)}
                            variant="contained">
                        {t("add_payment")}
                    </Button>
                </Stack>
                <Stack spacing={0.5}>
                    {rows.map((row: any) => (
                        <Stack direction="row" spacing={1} key={row.uuid}>
                            <Box width={30}/>
                            <TransactionMobileCard
                                {...{
                                    theme,
                                    row,
                                    setOpenDeleteTransactionDialog,
                                    setSelected,
                                    devise,
                                    pmList,
                                    t,
                                    setCollapse,
                                    selectedRow,
                                    collapse,
                                    transaction_data,
                                    transaction_loading,
                                }}
                            />
                        </Stack>
                    ))}
                    {
                        rows && rows.length === 0 && <NoDataCard t={t} ns={"payment"} data={{
                            mainIcon: "ic-argent",
                            title: "noTransaction",
                            description: "addTransaction"
                        }}/>
                    }
                </Stack>
            </Box>

            <Dialog
                action={"payment_dialog"}
                {...{
                    direction,
                    sx: {
                        minHeight: 460
                    }
                }}
                open={openPaymentDialog}
                data={{
                    patient,
                    setOpenPaymentDialog,
                    mutatePatient: () => {
                        mutateTransactions();
                        walletMutate();
                        const url = `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/preview/${router.locale}`;
                        invalidateQueries([url])
                    }
                }}
                size={"lg"}
                fullWidth
                title={t("payment_dialog_title", {ns: "payment"})}
                dialogClose={() => {
                    setOpenPaymentDialog(false)
                }}
            />

            <Dialog
                action="delete-transaction"
                title={t("dialogs.delete-dialog.title")}
                open={openDeleteTransactionDialog}
                size="sm"
                data={{t}}
                color={theme.palette.error.main}
                actionDialog={
                    <Stack direction="row" spacing={1}>
                        <Button
                            onClick={() => {
                                setLoadingDeleteTransaction(false);
                                setOpenDeleteTransactionDialog(false);
                            }}
                            startIcon={<CloseIcon/>}
                        >
                            {t("cancel")}
                        </Button>
                        <LoadingButton
                            variant="contained"
                            loading={loadingDeleteTransaction}
                            color="error"
                            onClick={deleteTransaction}
                            startIcon={<IconUrl path="setting/icdelete" color="white"/>}
                        >
                            {t("delete")}
                        </LoadingButton>
                    </Stack>
                }
            />

            <Dialog
                action="delete-transaction"
                title={t("dialogs.delete-dialog.title")}
                open={openDeleteTransactionData}
                size="sm"
                data={{t}}
                color={theme.palette.error.main}
                actionDialog={
                    <Stack direction="row" spacing={1}>
                        <Button
                            onClick={() => {
                                setLoadingDeleteTransactionData(false);
                                setOpenDeleteTransactionData(false);
                            }}
                            startIcon={<CloseIcon/>}
                        >
                            {t("cancel")}
                        </Button>
                        <LoadingButton
                            variant="contained"
                            loading={loadingDeleteTransactionData}
                            color="error"
                            onClick={deleteTransactionData}
                            startIcon={<IconUrl path="setting/icdelete" color="white"/>}>
                            {t("delete")}
                        </LoadingButton>
                    </Stack>
                }
            />

            <Dialog action={"document_detail"}
                    open={openDialog}
                    data={{
                        state, setState,
                        setOpenDialog
                    }}
                    size={"lg"}
                    direction={'ltr'}
                    sx={{p: 0}}
                    title={t("config.doc_detail_title", {ns: "patient"})}
                    onClose={handleCloseDialog}
                    dialogClose={handleCloseDialog}
            />
        </>
    );
}

export default TransactionPanel;
