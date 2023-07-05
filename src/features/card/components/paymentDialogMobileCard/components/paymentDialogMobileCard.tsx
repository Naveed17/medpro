import { CardContent, Link, Stack, Typography } from '@mui/material'
import Icon from '@themes/urlIcon';
import React from 'react'
import PaymentDialogMobileCardStyled from './overrides/paymentDialogMobileCardStyle'
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";

function PaymentMobileCard({ ...props }) {
    const { data, t } = props;

    const {data: session} = useSession();
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    return (
        <PaymentDialogMobileCardStyled>
            <CardContent>
                <Stack spacing={1}>
                    <Stack className='date-time' direction="row" alignItems='center'>
                        <Stack spacing={0.5} direction="row" alignItems='center' width="50%">
                            <Icon path="ic-agenda-jour" />
                            <Typography fontWeight={600}>
                                {data.date}
                            </Typography>
                        </Stack>
                        <Stack spacing={0.5} direction="row" alignItems='center'>
                            <Icon path="ic-agenda-jour" />
                            <Typography fontWeight={600}>
                                {data.date2}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack className='date-time' direction="row" alignItems='center'>
                        <Stack spacing={0.5} direction="row" alignItems='center' width="50%">
                            <Icon path="ic-time" />
                            <Typography fontWeight={600}>
                                {data.time}
                            </Typography>
                        </Stack>
                        <Link underline="none">
                            {data.amount} {devise}
                        </Link>

                    </Stack>
                    {data.payment_type?.map((type: any, i: number) =>
                        <Stack key={i} direction="row" alignItems="center"
                               justifyContent={"flex-end"}
                               spacing={1}>
                            <Icon path={type.icon}/>
                            <Typography color="text.primary"
                                        variant="body2">{t("table." + type.label)}</Typography>
                        </Stack>
                    )}
                </Stack>

            </CardContent>
        </PaymentDialogMobileCardStyled>
    )
}

export default PaymentMobileCard
