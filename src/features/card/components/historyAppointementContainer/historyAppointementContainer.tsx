import {AppointHistoryContainerStyled} from "@features/card";
import React from "react";

export default function HistoryAppointementContainer({...props}) {
    const {children, isHistory} = props;
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
