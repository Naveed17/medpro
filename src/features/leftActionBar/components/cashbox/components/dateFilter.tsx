import {Box, Checkbox, Collapse, FormControlLabel} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import moment from "moment/moment";
import {useAppDispatch} from "@lib/redux/hooks";
import Datepicker from "react-tailwindcss-datepicker";

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
    const {t} = useTranslation('payment', {keyPrefix: 'filter'});

    const [isActive, setIsActive] = useState(byPeriod);
    const [value, setValue] = useState({
        startDate: startDate,
        endDate: endDate
    });

    const handleValueChange = (newValue: any) => {
        setValue(newValue);
        if (newValue.startDate && newValue.endDate) {
            setStartDate(moment(newValue.startDate, "YYYY-MM-DD").toDate())
            setEndDate(moment(newValue.endDate, "YYYY-MM-DD").toDate())
            dispatch(setFilterCB({
                ...filterCB,
                start_date: moment(newValue.startDate, "YYYY-MM-DD").format('DD-MM-YYYY'),
                end_date: moment(newValue.endDate, "YYYY-MM-DD").format('DD-MM-YYYY')
            }));
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
                <Datepicker
                    value={value as any}
                    displayFormat={"DD/MM/YYYY"}
                    onChange={handleValueChange}
                />
            </Collapse>
        </Box>
    )
}

export default DateFilter
