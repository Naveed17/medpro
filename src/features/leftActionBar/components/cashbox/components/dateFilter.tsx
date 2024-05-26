import {Box, Checkbox, Collapse, FormControlLabel} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import moment from "moment/moment";
import {useAppDispatch} from "@lib/redux/hooks";
import Datepicker from "react-tailwindcss-datepicker";
import {useRouter} from "next/router";
import {AbilityContext} from "@features/casl/can";

function DateFilter({...props}) {

    const {
        filterDate,
        byPeriod,
        setByPeriod,
        filterCB,
        setFilterCB,
        currentDate,
        startDate,
        setStartDate,
        endDate,
        setEndDate
    } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const ability = useContext(AbilityContext);

    const elSideBar = document.getElementsByClassName('action-bar-open')[0] as HTMLElement

    const {t} = useTranslation('payment', {keyPrefix: 'filter'});

    const [isActive, setIsActive] = useState(byPeriod);
    const [value, setValue] = useState({
        startDate: startDate,
        endDate: endDate
    });

    const handleValueChange = (newValue: any) => {
        setValue(newValue);
        if (newValue.startDate && newValue.endDate) {
            elSideBar.style.overflow = "auto";
            setStartDate(moment(newValue.startDate, "YYYY-MM-DD").toDate())
            setEndDate(moment(newValue.endDate, "YYYY-MM-DD").toDate())
            dispatch(setFilterCB({
                ...filterCB,
                start_date: moment(newValue.startDate, "YYYY-MM-DD").format('DD-MM-YYYY'),
                end_date: moment(newValue.endDate, "YYYY-MM-DD").format('DD-MM-YYYY')
            }));
        } else {
            setTimeout(() => {
                const el = document.querySelector('.transition-all.opacity-1') as HTMLElement
                if (!el) {
                    elSideBar.style.overflow = "auto";
                    setIsActive(false)
                } else {
                    elSideBar.style.overflow = "visible";
                }
            }, 100);
        }
    }

    useEffect(() => {
        setIsActive(byPeriod)
    }, [byPeriod]);

    return (
        <Box>
            <FormControlLabel
                label={`${t('filterByPeriod')}`}
                disabled={!filterDate}
                control={
                    <Checkbox
                        checked={isActive}
                        onChange={() => {
                            if (!isActive) {
                                dispatch(setFilterCB({
                                    ...filterCB,
                                    start_date: moment(startDate).format('DD-MM-YYYY'),
                                    end_date: moment(endDate).format('DD-MM-YYYY')
                                }));
                            } else {
                                dispatch(setFilterCB({
                                    ...filterCB,
                                    start_date: moment(currentDate.date).format('DD-MM-YYYY'),
                                    end_date: moment(currentDate.date).format('DD-MM-YYYY')
                                }));
                            }
                            setIsActive(!isActive);
                            setByPeriod(!isActive);
                        }}
                    />
                }
            />

            <Collapse in={isActive && filterDate} timeout="auto" unmountOnExit>
                <div dir={"ltr"}
                     onBlur={() => {
                         setTimeout(() => {
                             const el = document.querySelector('.transition-all.opacity-1') as HTMLElement
                             elSideBar.style.overflow = el ? "visible" : "auto";
                         }, 100);
                     }}
                     onClick={() => {
                         setTimeout(() => {
                             const el = document.querySelector('.transition-all.opacity-1') as HTMLElement
                             elSideBar.style.overflow = el ? "visible" : "auto";
                         }, 10);
                     }}>
                    <Datepicker
                        {...(!ability.can('manage', 'cashbox', 'cash_box__transaction__history') && {minDate: moment().toDate()})}
                        i18n={router.locale}
                        inputClassName="w-full rounded-md focus:ring-0 font-normal border border-gray-300 p-2"
                        value={value as any}
                        displayFormat={"DD/MM/YYYY"}
                        onChange={handleValueChange}
                    />
                </div>
            </Collapse>
        </Box>
    )
}

export default DateFilter
