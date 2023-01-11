// components
import {ActionBarState, BoxStyled, FilterRootStyled, PatientFilter} from "@features/leftActionBar";
import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import {useAppSelector} from "@app/redux/hooks";
import {agendaSelector, DayOfWeek} from "@features/calendar";
import moment from "moment-timezone";
import {Accordion} from "@features/accordion";
import {Box, Checkbox, FormControlLabel, Stack} from "@mui/material";
import {useTranslation} from "next-i18next";
import {useRequest} from "@app/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import ItemCheckbox from "@themes/overrides/itemCheckbox";

const CalendarPickers = dynamic(() =>
    import("@features/calendar/components/calendarPickers/components/calendarPickers"));

function Payment() {

    const paymentTypes = [
        {
            icon: 'ic-argent',
            name: 'cash'
        },
        {
            icon: 'ic-card',
            name: 'card'
        },
        {
            icon: 'ic-cheque',
            name: 'check'
        },
        {
            icon: 'ic-card',
            name: 'Alimentation'
        },
        {
            icon: 'ic-card',
            name: 'Encaissement'
        },

    ]

    const {config: agendaConfig, sortedData: notes} = useAppSelector(agendaSelector);
    const locations = agendaConfig?.locations;
    const [disabledDay, setDisabledDay] = useState<number[]>([]);
    const router = useRouter();
    const {data: session} = useSession();
    const headers = {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
    }
    const [insurances, setInsurances] = useState<InsuranceModel[]>([]);

    const hours = locations && locations[0].openingHours[0].openingHours;
    const newVersion = process.env.NODE_ENV === 'development';

    useEffect(() => {
        const disabledDay: number[] = []
        hours && Object.entries(hours).filter((openingHours: any) => {
            if (!(openingHours[1].length > 0)) {
                disabledDay.push(DayOfWeek(openingHours[0]));
            }
        });
        setDisabledDay(disabledDay);
    }, [hours]);

    const {data} = useRequest({
        method: "GET",
        url: "/api/public/insurances/" + router.locale,
        headers
    });

    useEffect(() => {
        if (data !== undefined)
            setInsurances((data as any).data);
    }, [data]);

    const {t, ready} = useTranslation('payment', {keyPrefix: 'filter'});

    return (
        <BoxStyled>
            <CalendarPickers
                renderDay
                {...{notes}}
                shouldDisableDate={(date: Date) => disabledDay.includes(moment(date).weekday())}/>

            {newVersion && <Accordion
                translate={{
                    t: t,
                    ready: ready,
                }}
                defaultValue={""}
                data={[
                    {
                        heading: {
                            id: "facturation",
                            icon: "ic-invoice",
                            title: "facturationState",
                        },
                        children: (
                            <Stack direction={"row"}>
                                <FormControlLabel
                                    label={t('yes')}
                                    control={
                                        <Checkbox
                                            checked={false}
                                            // onChange={handleChange1}
                                        />
                                    }
                                />
                                <FormControlLabel
                                    label={t('no')}
                                    control={
                                        <Checkbox
                                            checked={false}
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
                                            console.log(v)
                                        }}
                                    ></ItemCheckbox>))}
                            </Box>
                        ),
                    },
                    {
                        heading: {
                            id: "insurance",
                            icon: "ic-assurance",
                            title: "insurance",
                        },
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
                                            console.log(v)
                                        }}
                                    ></ItemCheckbox>))}
                            </Box>
                        ),
                    },
                    {
                        heading: {
                            id: "patient",
                            icon: "ic-patient",
                            title: "patient",
                        },
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
                                                {label: "name", placeholder: "name"},
                                                {label: "birthdate", placeholder: "--/--/----"},
                                                {label: "phone", placeholder: "phone"},
                                            ],
                                        },
                                    }} t={t}/>
                            </FilterRootStyled>
                        ),
                    }
                ]}
            />}

        </BoxStyled>
    )
}

export default Payment
