import AppointHistoryContainerStyled
    from "@features/appointHistoryContainer/components/overrides/appointHistoryContainerStyle";
import {Button, Stack, Toolbar, Typography} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import React from "react";

export default function HistoryAppointementContainer({...props}) {
    const {children,isHistory, closeHistory,appointement,t} = props;
    return (
        <>
            {isHistory ?
                <AppointHistoryContainerStyled>
                    <Toolbar>
                        <Stack spacing={1.5} direction="row" alignItems="center" justifyContent={"space-between"}
                               width={"100%"}>
                            <Stack spacing={1.5} direction="row" alignItems="center">
                                <IconUrl path={'ic-speaker'}/>
                                <Typography>{t('consultationIP.updateHistory')} {appointement?.day_date}.</Typography>
                            </Stack>
                            <Button
                                onClick={closeHistory}
                                className="btn-action"
                                color="warning"
                                size="small"
                                startIcon={<IconUrl path="ic-retour"/>}>
                                {t('consultationIP.back')}
                            </Button>
                        </Stack>
                    </Toolbar>
                    {children}
                </AppointHistoryContainerStyled> : <>{children}</>
            }
        </>
    )
}
