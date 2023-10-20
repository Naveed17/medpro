import { CardContent, IconButton, Link, Stack, Typography,useTheme,Theme } from '@mui/material'
import Icon from '@themes/urlIcon';
import React from 'react'
import PaymentDialogMobileCardStyled from './overrides/paymentDialogMobileCardStyle'
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import moment from 'moment-timezone';
import {useInsurances} from "@lib/hooks/rest";
function PaymentMobileCard({ ...props }) {
    const theme = useTheme<Theme>()
    const { data, t,handleEvent,index,patient} = props;

    const {data: session} = useSession();
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;
     const {insurances} = useInsurances();

    let insurance = null;
    const insuranceUUID = data.insurance && patient ? patient.insurances.find((i: { uuid: string; }) => i.uuid === data.insurance).insurance.uuid : "";

    if (insuranceUUID !== "") {
        insurance = insurances.find(i => i.uuid === insuranceUUID);
    }
    return (
        <PaymentDialogMobileCardStyled>
            <CardContent>
                <Stack spacing={1}>
                    <Stack  direction='row' spacing={2} alignItems="center">
                        <Stack className="date-time" direction='row' spacing={.5} alignItems="center">
                            <Icon path="ic-agenda"/>
                            <Typography variant="body2">
                                {data.payment_date}
                            </Typography>
                        </Stack>
                        <Typography
                        variant="body2"
                        textAlign={"center"}
                        color={"primary"}>{data.amount} {devise}</Typography>
                        <Stack direction={"row"} justifyContent={"flex-end"} spacing={2}>
                        {
                            data.payment_means && <Stack direction="row" alignItems="center"
                                                        justifyContent={"flex-end"}
                                                        spacing={1}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img width={10} src={data.payment_means.logoUrl.url}
                                     alt={'payment means icon'}/>
                                <Typography color="text.primary"
                                            variant="body2">{t(data.payment_means.name)}</Typography>
                            </Stack>
                        }
                        {insurance &&
                            <Stack direction="row" alignItems="center"
                                   justifyContent={"flex-end"}
                                   spacing={1}>

                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img width={10} src={insurance?.logoUrl.url}
                                     alt={'insurance icon'}/>

                                <Typography color="text.primary"
                                            variant="body2">{insurance.name}</Typography>
                            </Stack>
                        }
                        {!data.payment_means && !insurance &&
                            <Stack direction="row" alignItems="center"
                                   justifyContent={"flex-end"}
                                   spacing={1}>

                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <Icon path={'ic-payment'} alt={'insurance icon'}/>

                                <Typography color="text.primary"
                                            variant="body2">{t('wallet')}</Typography>
                            </Stack>
                        }
                        
                    </Stack>
                    </Stack>
                       <IconButton
                            color={"error"}
                            size={"medium"}
                            onClick={() => {
                                handleEvent("delete", index);
                            }}>
                            <Icon path="setting/icdelete" width={"16"} height={"16"} color={theme.palette.error.main}/>
                        </IconButton>
                
                </Stack>

            </CardContent>
        </PaymentDialogMobileCardStyled>
    )
}

export default PaymentMobileCard
