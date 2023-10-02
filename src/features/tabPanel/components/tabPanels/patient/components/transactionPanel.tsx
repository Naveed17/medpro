import {Box, Button, DialogActions, LinearProgress, Stack, Typography} from '@mui/material'
import React, {useState} from 'react'
import PanelStyled from './overrides/panelStyle'
import {useTranslation} from "next-i18next";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {Otable} from "@features/table";
import {useAppSelector} from "@lib/redux/hooks";
import {TransactionStatus, TransactionType} from "@lib/constants";
import {DesktopContainer} from "@themes/desktopConainter";
import {useMedicalEntitySuffix} from '@lib/hooks';
import {useInsurances} from '@lib/hooks/rest';
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import {configSelector} from "@features/base";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import IconUrl from "@themes/urlIcon";
import {useSnackbar} from "notistack";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import moment from "moment/moment";

const headCells = [
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
        numeric: true,
        disablePadding: false,
        label: "time",
        sortable: true,
        align: "left",
    },
    {
        id: "insurance",
        numeric: true,
        disablePadding: false,
        label: "insurance",
        sortable: true,
        align: "center",
    },
    {
        id: "type",
        numeric: true,
        disablePadding: false,
        label: "type",
        sortable: true,
        align: "center",
    },
    {
        id: "payment_type",
        numeric: true,
        disablePadding: false,
        label: "payment_type",
        sortable: true,
        align: "center",
    },
    /*{
          id: "billing_status",
          numeric: true,
          disablePadding: false,
          label: "billing_status",
          sortable: true,
          align: "center",
      },*/
    {
        id: "amount",
        numeric: true,
        disablePadding: false,
        label: "amount",
        sortable: true,
        align: "center",
    },
    /* {
         id: "actions",
         numeric: true,
         disablePadding: false,
         label: "actions",
         sortable: true,
         align: "center",
     },*/
];

function TransactionPanel({...props}) {
    const {patient, wallet, rest, walletMutate, devise, router} = props;

    const {insurances} = useInsurances();
    const {enqueueSnackbar} = useSnackbar();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t} = useTranslation(["payment", "common"]);
    const {selectedBoxes} = useAppSelector(cashBoxSelector);
    const {direction} = useAppSelector(configSelector);

    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [loadingRequest, setLoadingRequest] = useState<boolean>(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);


    const {trigger: triggerPatientWallet} = useRequestQueryMutation("/patient/wallet");

    const {data: paymentMeansHttp} = useRequestQuery({
        method: "GET",
        url: `/api/public/payment-means/${router.locale}`
    }, ReactQueryNoValidateConfig);

    const {data: httpTransactionsResponse, mutate: mutateTransactions, isLoading} = useRequestQuery(patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/transactions/${router.locale}`
    } : null, {
        keepPreviousData: true,
        ...(patient && {variables: {query: `?cashboxes=${selectedBoxes[0].uuid}&patient=${patient.uuid}`}})
    });

    const handleSubmit = () => {
        setLoadingRequest(true)
        let amount = 0
        const data: TransactionDataModel[] = [];
        selectedPayment.payments.map((sp: any) => {
            const payDate = moment(sp.payment_date, 'DD-MM-YYYY HH:mm');
            data.push({
                payment_means: sp.payment_means.uuid,
                insurance: "",
                amount: sp.amount,
                status_transaction: TransactionStatus[0].value,
                type_transaction: TransactionType[4].value,
                payment_date: payDate.format('DD-MM-YYYY'),
                payment_time: payDate.format('HH:mm'),
                data: {label: sp.designation, ...sp.data},
            });
            amount += sp.amount;
        });

        const form = new FormData();
        form.append("type_transaction", TransactionType[4].value);
        form.append("status_transaction", TransactionStatus[0].value);
        form.append("cash_box", selectedBoxes[0].uuid);
        form.append("amount", amount.toString());
        form.append("rest_amount", "0");
        form.append("patient", patient.uuid);
        form.append("transaction_data", JSON.stringify(data));

        triggerPatientWallet({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/transactions/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                enqueueSnackbar(`${t('transactionAdded')}`, {variant: "success"})
                mutateTransactions().then(() => {
                    walletMutate().then(() => setOpenPaymentDialog(false))
                });
            },
            onSettled: () => setLoadingRequest(false)
        });
    }

    const rows = (httpTransactionsResponse as HttpResponse)?.data?.transactions?.reverse() ?? [];
    const pmList = (paymentMeansHttp as HttpResponse)?.data ?? [];

    return (
        <PanelStyled>
            {isLoading && <LinearProgress/>}
            {!isLoading && <Box className="files-panel">
                <Stack justifyContent={"end"} direction={"row"} spacing={1} mb={2} mt={1}>
                    <Button size='small'
                            onClick={() => {
                                setSelectedPayment({
                                    uuid: "",
                                    payments: [],
                                    payed_amount: 0,
                                    total: 0,
                                    patient: patient.uuid,
                                    isNew: true
                                });
                                setOpenPaymentDialog(true)
                            }}
                            variant='contained'
                            color={"success"}>
                        {t("wallet")}
                        <Typography fontWeight={700} component='strong'
                                    mx={1}>+ {wallet}</Typography>
                        {devise}
                    </Button>
                    <Button size='small'
                            variant='contained'
                            color={"error"}>
                        {t("credit")}
                        <Typography fontWeight={700} component='strong'
                                    mx={1}>- {rest}</Typography>
                        {devise}
                    </Button>

                </Stack>
                <DesktopContainer>
                    {!isLoading && <Otable
                        {...{rows, t, insurances, pmList, mutateTransactions, hideName: true}}
                        headers={headCells}
                        from={"cashbox"}
                    />}
                </DesktopContainer>
            </Box>}

            <Dialog
                action={"payment_dialog"}
                {...{
                    direction,
                    sx: {
                        minHeight: 380,
                    },
                }}
                open={openPaymentDialog}
                data={{
                    selectedPayment,
                    setSelectedPayment,
                    patient,
                }}
                size={"lg"}
                fullWidth
                title={t('payment_dialog_title')}
                dialogClose={() => {
                    setOpenPaymentDialog(false)
                }}
                actionDialog={
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenPaymentDialog(false)
                        }} startIcon={<CloseIcon/>}>
                            {t("config.cancel", {ns: "common"})}
                        </Button>
                        <LoadingButton
                            disabled={
                                selectedPayment && selectedPayment.payments.length === 0
                            }
                            loading={loadingRequest}
                            variant="contained"
                            onClick={handleSubmit}
                            startIcon={<IconUrl path="ic-dowlaodfile"/>}>
                            {t("config.save", {ns: "common"})}
                        </LoadingButton>
                    </DialogActions>
                }
            />
        </PanelStyled>
    )
}

export default TransactionPanel
