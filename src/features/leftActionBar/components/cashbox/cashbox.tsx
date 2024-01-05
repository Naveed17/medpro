// components
import {
    BoxStyled,
    cashBoxSelector,
    setFilterCB,
    setInsurances,
    setPaymentTypes
} from "@features/leftActionBar";
import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {agendaSelector, DayOfWeek, setCurrentDate} from "@features/calendar";
import moment from "moment-timezone";
import {Accordion} from "@features/accordion";
import {Box, Typography} from "@mui/material";
import {useTranslation} from "next-i18next";
import ItemCheckbox from "@themes/overrides/itemCheckbox";
import {BoxesFilter, DateFilter} from "@features/leftActionBar/components/cashbox/overrides";
import {dashLayoutSelector} from "@features/base";
import {useInsurances} from "@lib/hooks/rest";


const CalendarPickers = dynamic(() =>
    import("@features/calendar/components/calendarPickers/components/calendarPickers"));

function Cashbox() {
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation('payment', {keyPrefix: 'filter'});
    const {
        selectedBoxes,
        insurances,
        paymentTypes,
        paymentTypesList,
        filterCB, selectedTab
    } = useAppSelector(cashBoxSelector);
    const {currentDate} = useAppSelector(agendaSelector);
    const {config: agendaConfig} = useAppSelector(agendaSelector);

    const [disabledDay, setDisabledDay] = useState<number[]>([]);
    const [filterDate, setFilterDate] = useState(true);
    const [byPeriod, setByPeriod] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [loadingInscurances, setLoadingInscurances] = useState(true);
    const [loadingPM, setLoadingPM] = useState(true);

    const hours = agendaConfig?.openingHours[0];

    const {medicalProfessionalData} = useAppSelector(dashLayoutSelector);
    const {insurances:insurancesList} =useInsurances();

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


    return (
        <BoxStyled className="container-filter">
            <CalendarPickers
                renderDay
                onDateChange={(date: Date | null) => {
                    if (date) {
                        dispatch(setCurrentDate({date, fallback: true}));
                    }
                }}
                shouldDisableDate={(date: Date) => disabledDay.includes(moment(date).weekday() + 1)}/>

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

                    ...(selectedTab === "transactions" ? [{
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
                    }] : []),
                    ...(selectedTab === "transactions" ? [{
                        heading: {
                            id: "boxes",
                            icon: "ic-invoice",
                            title: "boxes",
                        },
                        expanded: true,
                        children: (
                            <BoxesFilter/>
                        ),
                    }] : []),
                    ...(selectedTab === "transactions" ? [{
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
                    }] : [])
                ]}
                setData={() => {

                }}
            />
        </BoxStyled>
    )
}

export default Cashbox
