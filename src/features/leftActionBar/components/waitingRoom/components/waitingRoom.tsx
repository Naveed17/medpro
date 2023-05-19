import React, {useEffect, useState} from "react";
import {Typography} from "@mui/material";
import WaitingRoomStyled from "./overrides/waitingRoomStyle";
import {Accordion} from '@features/accordion';
import {useTranslation} from "next-i18next";
import {AppointmentTypesFilter} from "@features/leftActionBar";
import {useAppSelector} from "@lib/redux/hooks";
import {LoadingScreen} from "@features/loadingScreen";
import {dashLayoutSelector} from "@features/base";

function WaitingRoom() {

    const {t, ready} = useTranslation('waitingRoom', {keyPrefix: 'filter'});
    const {appointmentTypes} = useAppSelector(dashLayoutSelector);

    const [accordionData, setAccordionData] = useState<any[]>([]);

    useEffect(() => {
        if (appointmentTypes) {
            setAccordionData([
                {
                    heading: {
                        id: "meetingType",
                        icon: "ic-agenda-jour-color",
                        title: "meetingType",
                    },
                    expanded: true,
                    children: (<AppointmentTypesFilter {...{t, ready}} />)
                },
            ])
        }
    }, [appointmentTypes]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <WaitingRoomStyled>
            <Typography
                variant="h6"
                color="text.primary"
                sx={{py: 5, pl: "10px", mb: "0.21em"}}
                gutterBottom
            >
                {t(`title`)}
            </Typography>
            <Accordion
                translate={{
                    t: t,
                    ready: ready,
                }}
                data={accordionData}
                setData={setAccordionData}
            />
        </WaitingRoomStyled>
    )
}

export default WaitingRoom;
