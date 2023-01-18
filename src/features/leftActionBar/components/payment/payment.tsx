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
    const router = useRouter();
    const {data: session} = useSession();

    const {t, ready} = useTranslation('payment', {keyPrefix: 'filter'});
    const {config: agendaConfig, sortedData: notes} = useAppSelector(agendaSelector);

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
    const locations = agendaConfig?.locations;
    const headers = {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
    }


    const {data: httpInsuranceResponse} = useRequest({
        method: "GET",
        url: "/api/public/insurances/" + router.locale,
        headers
    });
    const insurances = (httpInsuranceResponse as HttpResponse)?.data as InsuranceModel[];

    const [disabledDay, setDisabledDay] = useState<number[]>([]);
    const [accordionData, setAccordionData] = useState<any[]>([
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
            expanded: false,
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
            expanded: false,
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
                                    {label: "fiche_id", placeholder: "fiche"},
                                    {label: "name", placeholder: "name"},
                                    {label: "birthdate", placeholder: "--/--/----"},
                                    {label: "phone", placeholder: "phone"},
                                ],
                            },
                        }} t={t}/>
                </FilterRootStyled>
            ),
        }
    ]);

    const hours = locations && locations[0].openingHours[0].openingHours;
    const dev = process.env.NODE_ENV === 'development';

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
        <BoxStyled>
            <CalendarPickers
                renderDay
                {...{notes}}
                shouldDisableDate={(date: Date) => disabledDay.includes(moment(date).weekday())}/>
            {dev && <Accordion
                translate={{
                    t: t,
                    ready: ready,
                }}
                defaultValue={""}
                data={accordionData}
                setData={setAccordionData}
            />}

        </BoxStyled>
    )
}

export default Payment
