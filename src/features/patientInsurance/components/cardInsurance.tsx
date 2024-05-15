import React from 'react';
import {IconButton, Stack, Typography, useTheme} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {useInsurances} from "@lib/hooks/rest";
import {SocialInsured} from "@lib/constants";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";

const CardInsurance = ({...props}) => {

    const {pi,t, setSelectedInsurance,deleteInsurance} = props;
    const {insurances} = useInsurances()

    const theme = useTheme();
    return (
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Stack>
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <Typography className={"name"}>{pi.insurance.name}</Typography>
                    <Typography className={"title"}>{t(`social_insured.${SocialInsured.find(si =>si.value == pi.type)?.label}`, {ns: "common"})}</Typography>
                </Stack>
                <Stack direction={"row"} spacing={1}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img width={25} height={25} src={insurances.find(insurance => pi.insurance.uuid === insurance.uuid)?.logoUrl.url}
                         alt={"insurance image"}/>
                    <Stack>
                        <Typography className={"number"}>{pi.insuranceNumber}</Typography>
                        {pi.insuranceBook?.endDate && <Typography className={"expireIn"}>{t('insurance.expire', {ns: "patient"})} {pi.insuranceBook.endDate}</Typography>}
                    </Stack>
                </Stack>
            </Stack>
            <Stack direction={"row"} spacing={1} style={{height: "fit-content"}}>
                <IconButton
                    onClick={event => {
                        event.stopPropagation();
                        setSelectedInsurance(pi.insurance.uuid)
                    }}
                    size="small">
                    <IconUrl path="ic-edit-pen" color={theme.palette.text.secondary}/>
                </IconButton>
                <IconButton
                    onClick={event => {
                        event.stopPropagation();
                        deleteInsurance(pi.uuid)
                    }}
                    size="small">
                    <IconUrl path="ic-delete" color={theme.palette.text.secondary}/>
                </IconButton>
            </Stack>
        </Stack>
    );
}

export default CardInsurance;
