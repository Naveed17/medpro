import {Box, Button, Card, CardContent, Checkbox, Collapse, FormControlLabel, FormGroup, IconButton, LinearProgress, Paper, Stack, Typography} from '@mui/material'
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
import { Label } from '@features/label';
import { DatePicker } from '@features/datepicker';
import IconUrl from '@themes/urlIcon';
import moment from "moment-timezone";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
interface StateProps {
    from: Date | null;
    to: Date | null;
}
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
    const {patient, rest, devise, router} = props;

    const {insurances} = useInsurances();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const [collapse,setCollapse] = useState<any>(null)
    const {t} = useTranslation(["payment", "common"]);
    const {selectedBoxes} = useAppSelector(cashBoxSelector);
    const {direction} = useAppSelector(configSelector);
    const [dateState, setDateState] = useState<StateProps>({
        from: null,
        to: null
    });
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
    console.log(rows)
    return (
        <PanelStyled>
            {/* <DesktopContainer>
                {!isLoading && <Otable
                     {...{rows, t, insurances, pmList, mutateTransactions, hideName: true}}
                      headers={headCells}
                 from={"cashbox"}
                  />}
                 </DesktopContainer> */}
            {isLoading && <LinearProgress/>}
            {!isLoading &&( 
            
            // <Box className="files-panel">
            //     <Stack justifyContent={"end"} direction={"row"} spacing={1} mb={2} mt={1}>
            //         {/*<Button size='small'
            //                 variant='contained'
            //                 color={"success"}>
            //             {t("wallet")}
            //             <Typography fontWeight={700} component='strong'
            //                         mx={1}>+ {wallet}</Typography>
            //             {devise}
            //         </Button>*/}
            //         <Button size='small'
            //                 variant='contained'
            //                 color={-1 * rest > 0 ? "success" : "error"}>
            //             {t("credit")}
            //             <Typography fontWeight={700} component='strong'
            //                         mx={1}> {-1 * rest}</Typography>
            //             {devise}
            //         </Button>

            //     </Stack>
            //     <DesktopContainer>
            //         {!isLoading && <Otable
            //             {...{rows, t, insurances, pmList, mutateTransactions, hideName: true}}
            //             headers={headCells}
            //             from={"cashbox"}
            //         />}
            //     </DesktopContainer>
            // </Box>
           <CardContent>
            <Stack spacing={1.2}>
            <Stack direction='row' alignItems="center" justifyContent='space-between' borderBottom={1} borderColor='divider' pb={1}>
                <Typography fontWeight={600}>{t('history')}</Typography>
                <Stack direction='row' alignItems="center" spacing={1} sx={{span:{borderRadius:.8}}}>
                    <Label variant='filled' color="warning" sx={{fontSize:18,strong:{ml:1}}}>
                        {t("total")} <strong>400 {devise}</strong>
                    </Label>
                    <Label variant='filled' color={-1 * rest > 0 ? "success" : "error"} sx={{fontSize:18,strong:{ml:1}}}>
                        {t("credit")} <strong>{-1 * rest} {devise}</strong>
                    </Label>
                    <Label variant='filled' color={"success"} sx={{fontSize:18,strong:{ml:1}}}>
                        {t("paid_amount")} <strong>{400} {devise}</strong>
                    </Label>
                </Stack>
            </Stack>
            <Stack direction='row' alignItems="center" spacing={1}>
                <Stack spacing={.5} width={1}>
                    <Typography variant='caption' color={"text.secondary"}>{t('from')}</Typography>
                    <DatePicker
                    inputFormat="dd/MM/yyyy"
                    value={dateState.from}
                    onChange={(date: Date) => {
                      setDateState({...dateState, from: date})
                    }}/>
                    
                </Stack>
                <IconUrl style={{marginTop:22}} path="ic-flesh"/>
                <Stack spacing={.5} width={1}>
                    <Typography variant='caption' color={"text.secondary"}>{t('to')}</Typography>
                    <DatePicker
                    inputFormat="dd/MM/yyyy"
                    value={dateState.to}
                    onChange={(date: Date) => {
                      setDateState({...dateState, to: date})
                    }}/>
                    
                </Stack>
            </Stack>
            <Stack spacing={.5}>
                <Typography variant='body2'>{t("status")}</Typography>
                <FormGroup row>
  <FormControlLabel control={<Checkbox />} label={t("paid")} />
  <FormControlLabel control={<Checkbox />} label="unpaid" />
</FormGroup>
            </Stack>
            <Stack spacing={1}>
                {
                    rows.map((row:any) => (
                <Card key={row.uuid}>
                    <CardContent>
                        <Stack direction='row' alignItems='center' justifyContent='space-between'>
                            <Typography fontWeight={700} display='flex' alignItems='center'>
                               Consultation
                               <Typography ml={.5} variant='body2'>
                                 {moment(row.date_transaction).format('DD/MM/YYYY')}
                                </Typography>
                                </Typography>
                                <IconButton sx={{svg:{transform:row.uuid === collapse ? "scale(-1)":"scale(1)"}}} className='btn-collapse' onClick={() => setCollapse(collapse === row.uuid ? null : row.uuid)}>
                                    <ExpandMoreIcon/>
                                </IconButton>
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={1}>
                             <Label variant='filled' color={"warning"} sx={{strong:{ml:1}}}>
                                {t("total")} <strong>{400} {devise}</strong>
                    </Label>
                        </Stack>
                        <Collapse in={row.uuid === collapse}>
                            fsdaf
                        </Collapse>
                    </CardContent>
                </Card>
                    ))
                }
                
            </Stack>
            </Stack>
           </CardContent>
            )}

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
                    patient,
                }}
                size={"lg"}
                fullWidth
                title={t('payment_dialog_title')}
                dialogClose={() => {
                    setOpenPaymentDialog(false)
                }}
            />
        </PanelStyled>
    )
}

export default TransactionPanel
