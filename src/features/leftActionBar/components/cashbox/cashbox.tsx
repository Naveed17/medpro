// components
import {
    BoxesFilter,
    BoxStyled,
    cashBoxSelector, DateFilter, InsuranceCashBoxFilter,
    setFilterCB,
    setInsurances,
    setPaymentTypes
} from "@features/leftActionBar";
import React, {useContext, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {agendaSelector, CalendarPickers, DayOfWeek, setCurrentDate} from "@features/calendar";
import moment from "moment-timezone";
import {Accordion} from "@features/accordion";
import {Box, Typography} from "@mui/material";
import {useTranslation} from "next-i18next";
import ItemCheckbox from "@themes/overrides/itemCheckbox";
import {AbilityContext} from "@features/casl/can";

function Cashbox() {
    const dispatch = useAppDispatch();
    const ability = useContext(AbilityContext);

    const {t, ready} = useTranslation('payment', {keyPrefix: 'filter'});
    const {
        selectedBoxes,
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
    const [loadingPM, setLoadingPM] = useState(true);
    const [dataCashBox, setDataCashBox] = useState<any[]>([]);

    const hours = agendaConfig?.openingHours && agendaConfig?.openingHours.length > 0 ? agendaConfig?.openingHours[0] : null;

    useEffect(() => {
        let boxes = '';
        selectedBoxes.map((box: { uuid: any; }, index: number) => {
            index === selectedBoxes.length - 1 ? boxes += `${box.uuid}` : boxes += `${box.uuid},`;
        });
        if (boxes !== '') {
            const newFilter = {
                start_date: filterDate ? !byPeriod ? moment(currentDate.date).format("DD-MM-YYYY") : moment(startDate).format('DD-MM-YYYY') : "",
                end_date: filterDate ? !byPeriod ? moment(currentDate.date).format("DD-MM-YYYY") : moment(endDate).format('DD-MM-YYYY') : "",
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
        if (!loadingPM) {
            let paymenttypeuuids = '';
            paymentTypes.map((box: { uuid: any; }, index: number) => {
                index === paymentTypes.length - 1 ? paymenttypeuuids += `${box.uuid}` : paymenttypeuuids += `${box.uuid},`;
            });
            dispatch(setFilterCB({payment_means: paymenttypeuuids}));
        }
        setLoadingPM(false)
    }, [paymentTypes]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setDataCashBox([
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
                children: <InsuranceCashBoxFilter
                    {...{t}}
                    OnSearch={(data: any) => {
                        dispatch(setInsurances(data.query.insurances ?? []));
                        dispatch(setFilterCB({
                            insurances: data.query?.insurances?.map((insurance: any) => insurance.uuid).join(',') ?? "",
                            not_insured_patient: data.query?.hasNoInsurance ?? false,
                        }));
                    }}/>
                ,
            }] : [])
        ])
    }, [selectedTab, filterCB]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <BoxStyled className="container-filter">
            <CalendarPickers
                renderDay
                {...(!ability.can('manage', 'cashbox', 'cash_box__transaction__history') && {disablePast: true})}
                onDateChange={(date: Date | null) => {
                    if (date) {
                        dispatch(setCurrentDate({date, fallback: true}));
                    }
                }}
                shouldDisableDate={(date: Date) => disabledDay.includes(moment(date).weekday() + 1)}/>

            <Accordion
                translate={{
                    t,
                    ready
                }}
                data={dataCashBox}
                setData={setDataCashBox}
            />
        </BoxStyled>
    )
}

export default Cashbox
