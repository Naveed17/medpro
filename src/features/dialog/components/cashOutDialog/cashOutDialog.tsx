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
import {useAppSelector} from "@lib/redux/hooks";
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import { DesktopContainer } from '@themes/desktopConainter';
import { MobileContainer } from '@themes/mobileContainer';
import {CashOutMobileCard} from "@features/card";

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
        id: "patient",
        numeric: false,
        disablePadding: true,
        label: "patient",
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
    const {
        selectedBoxes
    } = useAppSelector(cashBoxSelector);


    const [totalCash, setTotalCash] = useState(0);
    const [totalCheck, setTotalCheck] = useState(0);
    const [cheques, setCheques] = useState<ChequeModel[]>([]);

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const router = useRouter();
    const theme = useTheme();

    const {checksToCashout, setChecksToCashout,collectedCash, setCollectedCash} = data;

    const {data: httpCollectResponse} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/cash-boxes/${selectedBoxes[0].uuid}/collect/${router.locale}`
    });

    useEffect(() => {
        if (httpCollectResponse) {
            const res = (httpCollectResponse as HttpResponse).data;
            setTotalCash(res.cash)
            setCheques(res.list)
        }
    }, [httpCollectResponse])
    const handleCheques = (props: ChequeModel) => {
        if (checksToCashout.indexOf(props) != -1) {
            checksToCashout.splice(checksToCashout.indexOf(props), 1);
        } else {
            checksToCashout.push(props);
        }
        setChecksToCashout([...checksToCashout]);
        const total = checksToCashout.reduce((acc:number, curr:ChequeModel) => acc + curr.amount, 0);
        setTotalCheck(total);
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
                    direction={{xs: "column", sm: "row"}}
                    spacing={{xs:1,sm:3}}
                    alignItems={{xs:"flex-start",sm:"center"}}
                    padding={2}>
                    <Typography variant={"body1"}>{t("somme")} <Typography fontSize={12}
                                                                           color={theme.palette.grey[700]}>(
                        Max: {totalCash} {devise} )</Typography></Typography>
                         <Stack direction={"row"} spacing={1} alignItems={"center"} width={{xs:'100%',sm:'auto'}}>
                            <TextField
                        fullWidth
                        value={collectedCash}
                        onChange={(ev) => {
                            if (Number(ev.target.value) <= totalCash) {
                                setCollectedCash(Number(ev.target.value));
                            }
                        }}
                        InputProps={{
                            sx: {
                                width: {xs:"100%",sm:"150px"},
                                textAlign: "center",
                            },
                        }}
                        placeholder={t("---")}
                    />
                    <Typography variant={"body1"} color={theme.palette.grey[700]}>
                        {devise}
                    </Typography>
                    </Stack>                                                            
                    

                </Stack>
            </PaymentDialogStyled>
            <DesktopContainer>
            <Otable
                headers={headCheques}
                rows={cheques}
                from={"chequesList"}
                t={t}
                select={checksToCashout}
                edit={handleCheques}
            />
            </DesktopContainer>
            <MobileContainer>
                <Stack spacing={2}>
                    {(httpCollectResponse ? cheques : Array.from({length:5})).map((card, idx) => (
                        <React.Fragment key={idx}>
                            <CashOutMobileCard
                                data={card}
                                handleEvent={handleCheques}
                                t={t}
                                selected={checksToCashout}
                                devise={devise}
                            
                            />
                        </React.Fragment>
                    ))}
                
                </Stack>
            </MobileContainer>
        </Box>
    )
}

export default CashOutDialog
