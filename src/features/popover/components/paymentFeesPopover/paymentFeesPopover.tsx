import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import {DefaultCountry} from "@lib/constants";
import {Button, LinearProgress, Stack, Typography} from "@mui/material";
import React from "react";
import PaymentFeesPopoverStyled from "./overrides/PaymentFeesPopoverStyled";

function PaymentFeesPopover({...props}) {
    const {row: appointment, t} = props;
    const {data: session} = useSession();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const getTransactionAmountPayed = (): number => {
        let payed_amount = 0;
        appointment?.transaction_data.forEach((td: { amount: number }) => payed_amount += td.amount);
        return payed_amount;
    }

    return (
        <PaymentFeesPopoverStyled>
            <LinearProgress sx={{visibility: !appointment ? "visible" : "hidden"}} color="warning"/>
            {appointment && <List sx={{p: 0}} aria-label="secondary mailbox folders">

                <Stack direction={"row"} spacing={1.2}
                       mb={1} {...(appointment.rest_amount === 0 && {justifyContent: "end"})}>
                    {appointment.rest_amount > 0 && <Button
                        size='small'
                        variant='contained'
                        color={"error"}>
                        {t("credit")}
                        <Typography
                            fontWeight={700} component='strong'
                            mx={1}> {appointment.rest_amount}</Typography>
                        {devise}
                    </Button>}
                    <Button
                        size='small'
                        variant='contained'
                        color={appointment.rest_amount === 0 ? "success" : "warning"}>
                        {t("total")}
                        <Typography
                            fontWeight={700} component='strong'
                            mx={1}> {appointment.rest_amount + getTransactionAmountPayed()}</Typography>
                        {devise}
                    </Button>
                </Stack>

                {appointment.transaction_data?.map((transaction: any, index: number) =>
                    <ListItemButton
                        dense
                        sx={{p: 0}}
                        key={index}
                        disableRipple
                        disableGutters>
                        <ListItemText
                            primary={`${transaction.payment_means?.name ?? transaction.insurance?.insurance.name ?? t('wallet')} Le ${transaction.payment_date}`}/>
                        <ListItemText sx={{textAlign: "right"}} primary={`${transaction.amount} ${devise}`}/>
                    </ListItemButton>)}
            </List>}
            <Divider/>
            {appointment && <List aria-label="main mailbox folders">
                <ListItemButton
                    dense
                    sx={{p: 0}}
                    disableRipple
                    disableGutters>
                    <ListItemText primary={t("paid_total")}/>
                    <ListItemText sx={{textAlign: "right"}}
                                  primary={`${getTransactionAmountPayed()} ${devise}`}/>
                </ListItemButton>
            </List>}
        </PaymentFeesPopoverStyled>
    )
}

export default PaymentFeesPopover;
