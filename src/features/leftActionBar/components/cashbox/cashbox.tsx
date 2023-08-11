// components
import {ActionBarState, BoxStyled, FilterRootStyled, PatientFilter} from "@features/leftActionBar";
import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {agendaSelector, DayOfWeek} from "@features/calendar";
import moment from "moment-timezone";
import {Accordion} from "@features/accordion";
import {Box, Checkbox, FormControlLabel, Stack, Typography} from "@mui/material";
import {useTranslation} from "next-i18next";
import ItemCheckbox from "@themes/overrides/itemCheckbox";
import {BoxesFilter, DateFilter} from "@features/leftActionBar/components/cashbox/overrides";
import {setFilterCB, setInsurances, setPaymentTypes} from "@features/leftActionBar/components/cashbox/actions";
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox/selectors";


const CalendarPickers = dynamic(() =>
    import("@features/calendar/components/calendarPickers/components/calendarPickers"));

function Cashbox() {

    const {config: agendaConfig, sortedData: notes} = useAppSelector(agendaSelector);
    const [disabledDay, setDisabledDay] = useState<number[]>([]);

    const [filterDate, setFilterDate] = useState(true);
    const [byPeriod, setByPeriod] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [loadingInscurances, setLoadingInscurances] = useState(true);
    const [loadingPM, setLoadingPM] = useState(true);
    const {currentDate} = useAppSelector(agendaSelector);

    const hours = agendaConfig?.openingHours[0];
    const dispatch = useAppDispatch();
    const {
        selectedBoxes,
        insurances,
        insurancesList,
        paymentTypes,
        paymentTypesList,
        filterCB
    } = useAppSelector(cashBoxSelector);

    useEffect(() => {
        let boxes = '';
        selectedBoxes.map((box: { uuid: any; }, index: number) => {
            index === selectedBoxes.length - 1 ? boxes += `${box.uuid}` : boxes += `${box.uuid},`;
        });
        if (boxes !== '') {
            const newFilter = {
                ...filterCB,
                start_date: filterDate ? !byPeriod ? moment(currentDate.date).format("DD-MM-YYYY") : moment(startDate).format('DD/MM/yyyy') : "",
                end_date: filterDate ? !byPeriod ? moment(currentDate.date).format("DD-MM-YYYY") : moment(endDate).format('DD/MM/yyyy') : "",
                cashboxes: boxes
            }
            if (JSON.stringify(newFilter) !== JSON.stringify(filterCB))
                dispatch(setFilterCB(newFilter));
        }
    }, [currentDate, filterDate, selectedBoxes]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const disabledDay: number[] = []
        hours && Object.entries(hours).filter((openingHours: any) => {
            if (!(openingHours[1].length > 0)) {
                disabledDay.push(DayOfWeek(openingHours[0]));
            }
        });
        setDisabledDay(disabledDay);
    }, [hours]);

    useEffect(() => {
        if (!loadingInscurances) {
            let insuranceuuids = '';
            insurances.map((box: { uuid: any; }, index: number) => {
                index === insurances.length - 1 ? insuranceuuids += `${box.uuid}` : insuranceuuids += `${box.uuid},`;
            });
            dispatch(setFilterCB({
                ...filterCB, insurances: insuranceuuids
            }));
        }
        setLoadingInscurances(false)

    }, [insurances]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!loadingPM) {
            let paymenttypeuuids = '';
            paymentTypes.map((box: { uuid: any; }, index: number) => {
                index === paymentTypes.length - 1 ? paymenttypeuuids += `${box.uuid}` : paymenttypeuuids += `${box.uuid},`;
            });
            dispatch(setFilterCB({
                ...filterCB, payment_means: paymenttypeuuids
            }));
        }
        setLoadingPM(false)
    }, [paymentTypes]); // eslint-disable-line react-hooks/exhaustive-deps

    const {t, ready} = useTranslation('payment', {keyPrefix: 'filter'});

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
                            <DateFilter {...{
                                filterDate,
                                setFilterDate,
                                byPeriod,
                                setByPeriod,
                                startDate,
                                currentDate,
                                setStartDate,
                                filterCB,
                                setFilterCB,
                                endDate,
                                setEndDate
                            }}/>
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
                            <BoxesFilter/>
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
                                            checked={filterCB.status_transaction === '1'}
                                            onChange={(ev) => {
                                                dispatch(setFilterCB({
                                                    ...filterCB,
                                                    status_transaction: ev.target.checked ? '1' : ''
                                                }));
                                            }}
                                        />
                                    }
                                />
                                <FormControlLabel
                                    label={t('no')}
                                    control={
                                        <Checkbox
                                            checked={filterCB.status_transaction === '2'}
                                            onChange={(ev) => {
                                                dispatch(setFilterCB({
                                                    ...filterCB,
                                                    status_transaction: ev.target.checked ? '2' : ''
                                                }));
                                            }
                                            }
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
                                {paymentTypesList.map((item: any, index: number) => (
                                    <ItemCheckbox
                                        key={`pt${index}`}
                                        data={item}
                                        checked={paymentTypes.some((sb: { uuid: any; }) => sb.uuid === item.uuid)}
                                        onChange={() => {
                                            const index = paymentTypes.findIndex((sb: {
                                                uuid: any;
                                            }) => sb.uuid === item.uuid)
                                            let boxes = [...paymentTypes]
                                            if (index >= 0) {
                                                boxes.splice(index, 1)
                                            } else {
                                                boxes.push(item);
                                            }
                                            dispatch(setPaymentTypes(boxes));
                                        }}
                                    ></ItemCheckbox>))}
                                {paymentTypesList.length === 0 && <Typography fontSize={12} textAlign={"center"}
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
                                {insurancesList && insurancesList.map((item: any, index: number) => (
                                    <ItemCheckbox
                                        key={index}
                                        data={item}
                                        checked={insurances.some((sb: { uuid: any; }) => sb.uuid === item.uuid)}
                                        onChange={() => {
                                            const index = insurances.findIndex((sb: {
                                                uuid: any;
                                            }) => sb.uuid === item.uuid)
                                            let boxes = [...insurances]
                                            if (index >= 0) {
                                                boxes.splice(index, 1)
                                            } else {
                                                boxes.push(item);
                                            }
                                            dispatch(setInsurances(boxes));
                                        }}
                                    ></ItemCheckbox>))}
                                {insurancesList.length === 0 && <Typography fontSize={12} textAlign={"center"}
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
                                        dispatch(setFilterCB({
                                            ...filterCB, ...data.query
                                        }));
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
                setData={() => {

                }}
            />
        </BoxStyled>
    )
}

export default Cashbox
