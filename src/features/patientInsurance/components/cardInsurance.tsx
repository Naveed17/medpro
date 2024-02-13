import React from 'react';
import {IconButton, Stack, Typography, useTheme} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {useInsurances} from "@lib/hooks/rest";

const CardInsurance = ({...props}) => {

    const {pi, setSelectedInsurance} = props;
    const {insurances} = useInsurances()

    const theme = useTheme();
    return (
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Stack>
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <Typography className={"name"}>{pi.insurance.name}</Typography>
                    <Typography className={"title"}>Lui même</Typography>
                </Stack>
                <Stack direction={"row"} spacing={1}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={insurances.find(insurance => pi.insurance.uuid === insurance.uuid)?.logoUrl.url}
                         alt={"insurance image"}/>
                    <Stack>
                        <Typography className={"number"}>{pi.insuranceNumber}</Typography>
                        <Typography className={"expireIn"}>expire le 24/09/2024</Typography>
                    </Stack>
                </Stack>
            </Stack>
            <Stack direction={"row"} spacing={1} style={{height: "fit-content"}}>
                <IconButton
                    onClick={event => {
                        event.stopPropagation();
                    }}
                    size="small">
                    <IconUrl path="ic-delete" color={theme.palette.text.secondary}/>
                </IconButton>
                <IconButton
                    onClick={event => {
                        event.stopPropagation();
                        setSelectedInsurance(pi.insurance.uuid)
                    }}
                    size="small">
                    <IconUrl path="ic-edit-pen" color={theme.palette.text.secondary}/>
                </IconButton>
            </Stack>
        </Stack>
    );
}

export default CardInsurance;
