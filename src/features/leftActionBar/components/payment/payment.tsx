// components
import {ActionBarState, BoxStyled, FilterRootStyled, PatientFilter} from "@features/leftActionBar";
import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {agendaSelector, DayOfWeek} from "@features/calendar";
import moment from "moment-timezone";
import {Accordion} from "@features/accordion";
import {Box, Checkbox, FormControlLabel, Stack, Typography} from "@mui/material";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import ItemCheckbox from "@themes/overrides/itemCheckbox";
import {setCashBox} from "@features/leftActionBar/components/payment/actions";
import {cashBoxSelector} from "@features/leftActionBar/components/payment/selectors";
import DateFilter from "@features/leftActionBar/components/payment/overrides/dateFilter";
import BoxesFilter from "@features/leftActionBar/components/payment/overrides/boxesFilter";

const CalendarPickers = dynamic(() =>
    import("@features/calendar/components/calendarPickers/components/calendarPickers"));

function Payment() {

    const {config: agendaConfig, sortedData: notes} = useAppSelector(agendaSelector);
    const locations = agendaConfig?.locations;
    const [disabledDay, setDisabledDay] = useState<number[]>([]);


    const [filterDate, setFilterDate] = useState(true);
    const [byPeriod, setByPeriod] = useState(false);

    const router = useRouter();
    const {data: session} = useSession();
    const headers = {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
    }
    const dispatch = useAppDispatch();
    const {selectedBox, insurances, paymentTypes, query} = useAppSelector(cashBoxSelector);

    const hours = locations && locations[0].openingHours[0].openingHours;
    const newVersion = process.env.NODE_ENV === 'development';
    const [cashboxes, setCashboxes] = useState<CashBox[]>([]);

    const [filterData, setFilterData] = useState<any[]>();

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

    const {t, ready} = useTranslation('payment', {keyPrefix: 'filter'});

    return (
        <BoxStyled>
            <CalendarPickers
                renderDay
                {...{notes, disabled: !filterDate || byPeriod}}
                shouldDisableDate={(date: Date) => disabledDay.includes(moment(date).weekday())}/>

            {
                newVersion && <Accordion
                    translate={{
                        t: t,
                        ready: ready,
                    }}
                    defaultValue={""}
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
