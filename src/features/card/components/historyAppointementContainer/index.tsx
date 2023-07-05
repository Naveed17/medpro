import AppointHistoryContainerStyled
    from "@features/appointHistoryContainer/components/overrides/appointHistoryContainerStyle";
import {Button, Stack, Toolbar, Typography} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import React from "react";
import {LoadingButton} from "@mui/lab";

export default function HistoryAppointementContainer({...props}) {
    const {children,isHistory, closeHistory,appointement,loadingReq,t} = props;
    return (
        <>
            {isHistory ?
                <AppointHistoryContainerStyled>
                    {children}
                </AppointHistoryContainerStyled> : <>{children}</>
            }
        </>
    )
}
