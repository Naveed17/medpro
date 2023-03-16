// components
import {ActionBarState, BoxStyled, FilterRootStyled, PatientFilter, setFilter} from "@features/leftActionBar";
import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {agendaSelector, DayOfWeek} from "@features/calendar";
import moment from "moment-timezone";
import {Accordion} from "@features/accordion";
import {
    Box,
    Checkbox,
    FormControlLabel,
    Stack,
    Typography
} from "@mui/material";
import {useTranslation} from "next-i18next";
import ItemCheckbox from "@themes/overrides/itemCheckbox";
import {
    InsuranceFilter,
    DateFilter,
    BoxesFilter,
    cashBoxSelector,
    setCashBox
} from "@features/leftActionBar";

const CalendarPickers = dynamic(() =>
    import("@features/calendar/components/calendarPickers/components/calendarPickers"));

function Payment() {
    const dispatch = useAppDispatch();

    const {selectedBox, insurances, paymentTypes, query} = useAppSelector(cashBoxSelector);
    const {t, ready} = useTranslation('payment', {keyPrefix: 'filter'});
    const {config: agendaConfig, sortedData: notes} = useAppSelector(agendaSelector);


    const [disabledDay, setDisabledDay] = useState<number[]>([]);
    const [filterDate, setFilterDate] = useState(true);
    const [byPeriod, setByPeriod] = useState(false);
    const [cashboxes, setCashboxes] = useState<CashBox[]>([]);
    const [filterData, setFilterData] = useState<any[]>();
    const [accordionData, setAccordionData] = useState<any[]>([{
        heading: {
            id: "insurance",
            icon: "ic-assurance",
            title: "insurance",
        },
        expanded: true,
        children: (
            <InsuranceFilter
                {...{t}}
                OnSearch={(data: { query: ActionBarState }) => {
                    dispatch(setFilter({payment: data.query}));
                }}/>
        ),
    }]);

    const locations = agendaConfig?.locations;
    const hours = locations && locations[0].openingHours[0].openingHours;
    const newVersion = process.env.NODE_ENV === 'development';


    useEffect(() => {
        if (cashboxes.length > 0) {
            dispatch(setCashBox(cashboxes[0]));
        }
    }, [cashboxes, dispatch])

    useEffect(() => {
        const disabledDay: number[] = []
        hours && Object.entries(hours).filter((openingHours: any) => {
            if (!(openingHours[1].length > 0)) {
                disabledDay.push(DayOfWeek(openingHours[0]));
            }
        });
        setDisabledDay(disabledDay);
    }, [hours]);


    return (
        <BoxStyled className="container-filter">
            <CalendarPickers
                renderDay
                {...{notes, disabled: !filterDate || byPeriod}}
                shouldDisableDate={(date: Date) => disabledDay.includes(moment(date).weekday())}/>

            <Accordion
                translate={{
                    t: t,
                    ready: ready,
                }}
                data={accordionData}
                setData={setFilterData}
            />

            {
                newVersion && <Accordion
                    translate={{
                        t: t,
                        ready: ready,
                    }}
                    data={[
                        {
                            heading: {
                                id: "date",
                                icon: "ic-agenda-jour",
                                title: "date",
                            },
                            expanded: true,
                            children: (
                                <DateFilter {...{filterDate, setFilterDate, byPeriod, setByPeriod}}/>
                            ),
                        },
                        {
                            heading: {
                                id: "boxes",
                                icon: "ic-invoice",
                                title: "boxes",
                            },
                            expanded: true,
                            children: (
                                <BoxesFilter {...{cashboxes, setCashboxes}}/>
                            ),
                        },
                        {
                            heading: {
                                id: "facturation",
                                icon: "ic-invoice",
                                title: "facturationState",
                            },
                            expanded: true,
                            children: (
                                <Stack direction={"row"}>
                                    <FormControlLabel
                                        label={t('yes')}
                                        control={
                                            <Checkbox
                                                //checked={false}
                                                onChange={(ev) => {
                                                    console.log(ev);
                                                }
                                                }
                                            />
                                        }
                                    />
                                    <FormControlLabel
                                        label={t('no')}
                                        control={
                                            <Checkbox
                                                // checked={false}
                                            />
                                        }
                                    />
                                </Stack>
                            ),
                        },
                        {
                            heading: {
                                id: "paymentType",
                                icon: "ic-argent",
                                title: "paymentType",
                            },
                            expanded: true,
                            children: (
                                <Box>
                                    {paymentTypes.map((item: any, index: number) => (
                                        <ItemCheckbox
                                            key={`pt${index}`}
                                            data={item}
                                            checked={
                                                false
                                            }
                                            onChange={(v: any) => {
                                                console.log(item.uuid);
                                            }}
                                        ></ItemCheckbox>))}
                                    {paymentTypes.length === 0 && <Typography fontSize={12} textAlign={"center"}
                                                                              color={"gray"}>{t('nopaymentMeans')}</Typography>}
                                </Box>
                            ),
                        },
                        {
                            heading: {
                                id: "insurance",
                                icon: "ic-assurance",
                                title: "insurance",
                            },
                            expanded: true,
                            children: (
                                <Box>
                                    {insurances.map((item: any, index: number) => (
                                        <ItemCheckbox
                                            key={index}
                                            data={item}
                                            checked={
                                                false
                                            }
                                            onChange={(v: any) => {
                                                console.log(item.uuid);
                                            }}
                                        ></ItemCheckbox>))}
                                    {insurances.length === 0 && <Typography fontSize={12} textAlign={"center"}
                                                                            color={"gray"}>{t('noInsurance')}</Typography>}
                                </Box>
                            ),
                        },
                        {
                            heading: {
                                id: "patient",
                                icon: "ic-patient",
                                title: "patient",
                            },
                            expanded: true,
                            children: (
                                <FilterRootStyled>
                                    <PatientFilter
                                        OnSearch={(data: { query: ActionBarState }) => {
                                            console.log(data)
                                        }}
                                        item={{
                                            heading: {
                                                icon: "ic-patient",
                                                title: "patient",
                                            },
                                            gender: {
                                                heading: "gender",
                                                genders: ["male", "female"],
                                            },
                                            textField: {
                                                labels: [
                                                    {label: "name", placeholder: "search"},
                                                    {label: "birthdate", placeholder: "--/--/----"}
                                                ],
                                            },
                                        }} t={t}/>
                                </FilterRootStyled>
                            ),
                        }
                    ]}
                    setData={setFilterData}
                />
            }

        </BoxStyled>
    )
}

export default Payment
