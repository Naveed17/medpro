import {Box, Button, LinearProgress, Stack, Typography} from '@mui/material'
import React, {useState} from 'react'
import PanelStyled from './overrides/panelStyle'
import {useTranslation} from "next-i18next";
import {useRequestQuery} from "@lib/axios";
import {Otable} from "@features/table";
import {useAppSelector} from "@lib/redux/hooks";
import {DesktopContainer} from "@themes/desktopConainter";
import {useMedicalEntitySuffix} from '@lib/hooks';
import {useInsurances} from '@lib/hooks/rest';
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import {configSelector} from "@features/base";
import {Dialog} from "@features/dialog";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import AddIcon from "@mui/icons-material/Add";
import IconUrl from "@themes/urlIcon";

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
    const {patient, rest, wallet, devise, walletMutate, router} = props;

    const {insurances} = useInsurances();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t} = useTranslation(["payment", "common"]);
    const {selectedBoxes} = useAppSelector(cashBoxSelector);
    const {direction} = useAppSelector(configSelector);

    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);

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

    const rows = (httpTransactionsResponse as HttpResponse)?.data?.transactions ?? [];
    const pmList = (paymentMeansHttp as HttpResponse)?.data ?? [];

    return (
        <PanelStyled>
            {isLoading && <LinearProgress/>}
            {!isLoading && <Box className="files-panel">
                <Stack justifyContent={"end"} direction={"row"} spacing={1} mb={2} mt={1}>
                    <Button size='small'
                            variant='contained'
                            startIcon={<IconUrl path={'ic-wallet-money'} color={'white'}/>}
                            color={"success"}>
                        <Typography fontWeight={700}
                                    component='strong'
                                    mx={1}> {wallet}</Typography>
                        {devise}
                    </Button>
                    <Button size='small'
                            variant='contained'
                            onClick={() => setOpenPaymentDialog(true)}
                            endIcon={<AddIcon/>}>
                        <Typography>{t('credit')}</Typography>
                        <Typography fontWeight={700} component='strong' mx={1}> {-1 * rest}</Typography>
                        {devise}
                    </Button>

                </Stack>
                <DesktopContainer>
                    {!isLoading && <Otable
                        {...{rows, t, insurances, pmList, mutateTransactions,walletMutate, hideName: true}}
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
                    }
                }}
                size={"lg"}
                fullWidth
                title={t("payment_dialog_title", {ns: "payment"})}
                dialogClose={() => {
                    setOpenPaymentDialog(false)
                }}
            />

        </PanelStyled>
    )
}

export default TransactionPanel
