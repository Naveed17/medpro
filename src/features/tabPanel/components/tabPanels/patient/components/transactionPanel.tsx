import {Box, Button, LinearProgress, Stack, Typography} from '@mui/material'
import React, {useEffect, useState} from 'react'
import PanelStyled from './overrides/panelStyle'
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRequest, useRequestMutation} from "@lib/axios";
import {onOpenPatientDrawer, Otable} from "@features/table";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import moment from "moment-timezone";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {DefaultCountry} from "@lib/constants";
import {DesktopContainer} from "@themes/desktopConainter";
import {useMedicalEntitySuffix} from '@lib/hooks';
import {MobileContainer} from '@themes/mobileContainer';
import {PaymentMobileCard} from '@features/card';
import { useInsurances } from '@lib/hooks/rest';
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";

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
    const {patient, router} = props;

    const {t} = useTranslation(["payment", "common"]);
    const {data: session} = useSession();
    const {insurances} = useInsurances();
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const [loading, setLoading] = useState(true);
    const [pmList, setPmList] = useState([]);
    const [rows, setRows] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [toReceive, setToReceive] = useState(0);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const {selectedBoxes} = useAppSelector(cashBoxSelector);


    const {data: paymentMeansHttp} = useRequest({
        method: "GET",
        url: "/api/public/payment-means/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`},
    }, SWRNoValidateConfig);

    const {data: httpTransactionsResponse, mutate: mutateTransctions} = useRequest( {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/transactions/${router.locale}?cashboxes=${selectedBoxes[0].uuid}&patient=${patient.uuid}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    } , SWRNoValidateConfig);

    useEffect(() => {
        if (httpTransactionsResponse) {
            const data = (httpTransactionsResponse as HttpResponse)?.data
            console.log(data.transactions)
            setTotal(data.total_amount)
            setToReceive(data.total_insurance_amount);
            if (data.transactions)
                setRows(data.transactions.reverse());

            setLoading(false);
        }
    }, [httpTransactionsResponse]);

    useEffect(() => {
        if (paymentMeansHttp) {
            const pList = (paymentMeansHttp as HttpResponse).data
            setPmList(pList);
        }
    }, [paymentMeansHttp]); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <PanelStyled>
            {loading && <LinearProgress/>}
            {!loading && <Box className="files-panel">
                <Stack justifyContent={"end"} direction={"row"} spacing={1} mb={2} mt={1}>
                    <Button size='small'
                            variant='contained'
                            color={"warning"}>
                        {t("wallet")}
                        <Typography fontWeight={700} component='strong'
                                    mx={1}>{patient?.wallet ? patient?.wallet : 0}</Typography>
                        {devise}
                    </Button>
                    <Button size='small'
                            variant='contained'>
                        {t("insurance")}
                        <Typography fontWeight={700} component='strong'
                                    mx={1}>{toReceive}</Typography>
                        {devise}
                    </Button>
                    <Button size='small'
                            variant='contained'
                            color={"success"}>
                        {t("total")}
                        <Typography fontWeight={700} component='strong'
                                    mx={1}>{total}</Typography>
                        {devise}
                    </Button>

                </Stack>
                <DesktopContainer>
                    {!loading && <Otable
                        {...{rows, t, insurances, pmList, mutateTransctions,hideName:true}}
                        headers={headCells}
                        from={"cashbox"}
                    />}
                </DesktopContainer>

            </Box>}
        </PanelStyled>
    )
}

export default TransactionPanel
