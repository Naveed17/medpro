import React, {useEffect, useState} from "react";
import {Typography} from "@mui/material";
import WaitingRoomStyled from "./overrides/waitingRoomStyle";
import {Accordion} from '@features/accordion';
import {SidebarCheckbox} from '@features/sidebarCheckbox';
import {useTranslation} from "next-i18next";
import {
    leftActionBarSelector,
    setFilter
} from "@features/leftActionBar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {LoadingScreen} from "@features/loadingScreen";
import {dashLayoutSelector} from "@features/base";

function WaitingRoom() {
    const dispatch = useAppDispatch();

    const {query} = useAppSelector(leftActionBarSelector);
    const {t, ready} = useTranslation('waitingRoom', {keyPrefix: 'filter'});
    const {appointmentTypes} = useAppSelector(dashLayoutSelector);

    const types = appointmentTypes ? [...appointmentTypes] : [];

    const [accordionData, setAccordionData] = useState<any[]>([]);

    useEffect(() => {
        types?.map(type => {
            Object.assign({...type}, {
                checked: query?.type?.split(',').find(typeObject => type.uuid === typeObject) !== undefined
            })
        });
    });

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
                    children: types?.map((item, index) => (
                        <React.Fragment key={index}>
                            <SidebarCheckbox
                                label={"name"}
                                translate={{
                                    t: t,
                                    ready: ready,
                                }}
                                data={item}
                                onChange={(selected: boolean) => {
                                    if (selected && !query?.type?.includes(item.uuid)) {
                                        dispatch(setFilter({
                                            type:
                                                item.uuid + (query?.type ? `,${query.type}` : "")
                                        }));
                                    } else {
                                        const sp = query?.type?.split(",") as string[];
                                        dispatch(setFilter({
                                            type:
                                                sp?.length > 1 ? query?.type?.replace(`${item.uuid},`, "") : undefined
                                        }))
                                    }
                                }}/>
                        </React.Fragment>
                    ))
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
