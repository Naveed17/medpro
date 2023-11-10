import {Box, Button, Card, CardContent, Checkbox, Collapse, FormControlLabel, FormGroup, IconButton, LinearProgress, Paper, Stack, Typography} from '@mui/material'
import React, {useEffect, useState} from 'react'
import PanelStyled from './overrides/panelStyle'
import {useTranslation} from "next-i18next";
import {useRequestQuery} from "@lib/axios";
import {useAppSelector} from "@lib/redux/hooks";
import {useMedicalEntitySuffix} from '@lib/hooks';
import {useInsurances} from '@lib/hooks/rest';
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import {configSelector} from "@features/base";
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
function TransactionPanel({...props}) {
    const {patient, rest, devise, router} = props;
    const {insurances} = useInsurances();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const [collapse,setCollapse] = useState<any>(null)
    const {t} = useTranslation(["payment", "common"]);
    const {selectedBoxes} = useAppSelector(cashBoxSelector);
    const [dateState, setDateState] = useState<StateProps>({
        from: null,
        to: null
    });

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
    return (
        <PanelStyled>
              {isLoading && <LinearProgress/>}
            {!isLoading &&( 
           <CardContent>
            <Stack spacing={1.2}>
            <Stack direction={{xs:'column',sm:'row'}} alignItems={{xs:'flex-start',sm:'center'}} justifyContent='space-between' borderBottom={1} borderColor='divider' pb={1}>
                <Typography fontWeight={600}>{t('history')}</Typography>
                <Stack direction={{xs:'column',sm:'row'}} mt={{xs:1,sm:0}} alignItems="center" spacing={1} width={{xs:'100%',sm:'auto'}} sx={{span:{borderRadius:.8,width:{xs:'100%',sm:'auto'}}}}>
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
                        <Stack direction='row'mt={{xs:1,sm:0}} alignItems='center' spacing={{xs:.5, sm:1}}
                        >
                             <Label variant='filled' color={"warning"} sx={{strong:{ml:{xs:.5,sm:1}}}}>
                                {t("total")} <strong>{400} {devise}</strong>
                             </Label>
                             <Label variant='filled' color={"error"} sx={{strong:{ml:{xs:.5,sm:1}}}}>
                                {t("credit")} <strong>{400} {devise}</strong>
                             </Label>
                              <Label variant='filled' color={"success"} sx={{strong:{ml:{xs:.5,sm:1}}}}>
                                {t("credit")} <strong>{400} {devise}</strong>
                             </Label>
                        </Stack>
                        <Collapse in={row.uuid === collapse}> 
                            <Box borderTop={1} borderColor='divider' mt={2} pt={1}>
                            <table className='collapse-table'>
                                <thead>
                                    <tr>
                                        <th align='left'>{t("act")}</th>
                                        <th align='left'>{t("qte")}</th>
                                        <th align='right'>{t("amount")} (DT)</th>
                                    </tr>
                                     
                                        <tr >
                                            <td align='left'>Consultation</td>
                                            <td align='left'>1</td>
                                            <td align='right'>100</td>
                                            
                                        </tr>
                                        <tr >
                                            <td align='left'>Consultation</td>
                                            <td align='left'>1</td>
                                            <td align='right'>100</td>
                                            
                                        </tr>
                                </thead>
                            </table>
                            <table className='table-calc'>
                                <tbody>
                                    <tr>
                                        <td align='right'>{t("total")} (DT)</td>
                                        <td align='right'>400</td>
                                    </tr>
                                    <tr>
                                        <td align='right'>{t("amount_paid")}</td>
                                        <td align='right'>400</td>
                                    
                                    </tr>
                                    <tr>
                                        <td align='right'>
                                            <Typography variant='subtitle1' fontWeight={700}>
                                                {t("rest_pay")}
                                            </Typography>
                                       </td>
                                        <td align='right'>
                                            <Typography fontWeight={700} variant='subtitle1'>
                                                50
                                            </Typography>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <Stack direction='row' justifyContent='flex-end' mt={1}>
                                <Button sx={{border:1,borderColor:'divider'}} startIcon={<IconUrl path="ic-print"/>} variant='text-primary'>{t("print")}</Button>
                            </Stack>
                            </Box>
                        </Collapse>
                    </CardContent>
                </Card>
                    ))
                }
                
            </Stack>
            </Stack>
           </CardContent>
            )}
        </PanelStyled>
    )
}

export default TransactionPanel
