import React, {useEffect, useState} from 'react'
import {Box, Button, Stack, TextField, Typography, useTheme} from '@mui/material'
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import {DefaultCountry} from "@lib/constants";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import PaymentDialogStyled from "@features/dialog/components/paymentDialog/overrides/paymentDialogStyle";
import {Otable} from "@features/table";
import {useRequest} from "@lib/axios";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
    align: "left" | "right" | "center";
}

const headCheques: readonly HeadCell[] = [
    {
        id: "no",
        numeric: false,
        disablePadding: true,
        label: "-",
        sortable: false,
        align: "center",
    },
    {
        id: "nb-cheque",
        numeric: false,
        disablePadding: true,
        label: "numcheque",
        sortable: true,
        align: "left",
    },
    {
        id: "carrier",
        numeric: false,
        disablePadding: true,
        label: "carrier",
        sortable: true,
        align: "left",
    },
    {
        id: "bank",
        numeric: false,
        disablePadding: true,
        label: "bank",
        sortable: true,
        align: "left",
    },
    {
        id: "date",
        numeric: true,
        disablePadding: true,
        label: "date",
        sortable: true,
        align: "center",
    },
    {
        id: "amount",
        numeric: true,
        disablePadding: true,
        label: "amount",
        sortable: true,
        align: "right",
    },
];

function CashOutDialog({...props}) {
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const {data} = props;

    const {t, ready} = useTranslation("payment");

    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();


    let [collectedCash, setCollectedCash] = useState(0);
    const [totalCash, setTotalCash] = useState(0);
    const [totalCheck, setTotalCheck] = useState(0);
    const [cheques, setCheques] = useState<ChequeModel[]>([]);

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const router = useRouter();
    const theme = useTheme();

    const {pmList, checksToCashout, setChecksToCashout} = data;
    const checkuuid = pmList.find((pm: { slug: string; }) => pm.slug === 'check').uuid
    const cashuuid = pmList.find((pm: { slug: string; }) => pm.slug === 'cash').uuid

    const {data: httpCheckResponse} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/transactions/${router.locale}?payment_means=${checkuuid}&&type_transaction=3&&status_transaction=3`,
    });
    const {data: httpCashResponse} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/transactions/${router.locale}?payment_means=${cashuuid}&&type_transaction=3&&status_transaction=3`
    });

    useEffect(() => {
        if (httpCheckResponse) {
            const transactions = (httpCheckResponse as HttpResponse).data.transactions;
            let checks: any[] = [];
            if (transactions) {
                transactions.forEach((transaction: { transaction_data: any[]; uuid: string; }) => {
                    transaction.transaction_data.filter(td => td.payment_means.slug === "check").forEach((td: any) => checks.push({
                        transaction_uuid: transaction.uuid,
                        transaction_data: td
                    }))
                })
                setCheques(checks);
            }

        }
    }, [httpCheckResponse])

    useEffect(() => {
        if (httpCashResponse) {
            const transactions = (httpCashResponse as HttpResponse).data.transactions;
            let cash = 0
            if (transactions) {
                transactions.map((transaction: { amount: number; }) => cash += transaction.amount)
                setTotalCash(cash);
            }

        }
    }, [httpCashResponse])
    const handleCheques = (props: ChequeModel) => {
        if (checksToCashout.indexOf(props) != -1) {
            checksToCashout.splice(checksToCashout.indexOf(props), 1);
        } else {
            checksToCashout.push(props);
        }
        setChecksToCashout([...checksToCashout]);
        let res = 0;
        checksToCashout.map((val: { transaction_data: { amount: number; }; }) => (res += val.transaction_data.amount))
        setTotalCheck(res)
    };

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <Box>
            <Stack justifyContent={"end"} direction={"row"} spacing={1} mb={2} mt={1}>
                <Button size='small'
                        variant='contained'>
                    {t("cash")}
                    <Typography fontWeight={700} component='strong'
                                mx={1}>{collectedCash}</Typography>
                    {devise}
                </Button>
                <Button size='small'
                        color={"warning"}
                        variant='contained'>
                    {t("check")}
                    <Typography fontWeight={700}
                                component='strong'
                                mx={1}>{totalCheck}</Typography>
                    {devise}
                </Button>
                <Button size='small'
                        color={"success"}
                        variant='contained'>
                    {t("total")}
                    <Typography fontWeight={700} component='strong'
                                mx={1}>{"0"}</Typography>
                    {devise}
                </Button>

            </Stack>
            <PaymentDialogStyled>
                <Stack
                    className={"tab-panel"}
                    direction={"row"}
                    spacing={3}
                    alignItems={"center"}
                    padding={2}>
                    <Typography variant={"body1"}>{t("somme")} <Typography fontSize={12}
                                                                           color={theme.palette.grey[700]}>(
                        Max: {totalCash} {devise} )</Typography></Typography>

                    <TextField
                        fullWidth
                        style={{width: "150px", textAlign: "center"}}
                        value={collectedCash}
                        onChange={(ev) => {
                            if (Number(ev.target.value) <= totalCash) {
                                setCollectedCash(Number(ev.target.value));
                            }
                        }}
                        InputProps={{
                            style: {
                                width: "150px",
                                textAlign: "center",
                            },
                        }}
                        placeholder={t("---")}
                    />
                    <Typography variant={"body1"} color={theme.palette.grey[700]}>
                        {devise}
                    </Typography>
                </Stack>
            </PaymentDialogStyled>
            <Otable
                headers={headCheques}
                rows={cheques}
                from={"chequesList"}
                t={t}
                select={checksToCashout}
                edit={handleCheques}
            />
        </Box>
    )
}

export default CashOutDialog
