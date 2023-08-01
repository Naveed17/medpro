import {Box, Checkbox, Collapse, FormControlLabel, Stack, TextField, Typography} from "@mui/material";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import React from "react";
import {useTranslation} from "next-i18next";
import moment from "moment/moment";
import {useAppDispatch} from "@lib/redux/hooks";

function DateFilter({...props}) {

    const {
        filterDate,
        setFilterDate,
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

    return (
        <Box>
            <FormControlLabel
                label={`${t('filterByDate')}`}
                control={
                    <Checkbox
                        checked={filterDate}
                        onChange={() => {
                            if (filterDate) {
                                setByPeriod(false);
                                setStartDate(currentDate.date)
                                setEndDate(new Date(currentDate.date))
                            } else{
                                console.log("search checkdate")
                                dispatch(setFilterCB({
                                    ...filterCB,
                                    start_date: moment(currentDate.date).format('DD/MM/yyyy'),
                                    end_date: moment(currentDate.date).format('DD/MM/yyyy')
                                }));
                            }
                            setFilterDate(!filterDate);
                        }}
                    />
                }
            />

            <FormControlLabel
                label={`${t('filterByPeriod')}`}
                disabled={!filterDate}
                control={
                    <Checkbox
                        checked={byPeriod}
                        onChange={() => {
                            if (!byPeriod){
                                console.log("search checkdate")
                                dispatch(setFilterCB({
                                    ...filterCB,
                                    start_date: moment(startDate).format('DD/MM/yyyy'),
                                    end_date: moment(endDate).format('DD/MM/yyyy')
                                }));
                            } else{
                                console.log("search checkdate")
                                dispatch(setFilterCB({
                                    ...filterCB,
                                    start_date: moment(currentDate.date).format('DD/MM/yyyy'),
                                    end_date: moment(currentDate.date).format('DD/MM/yyyy')
                                }));
                            }
                            setByPeriod(!byPeriod);
                        }}
                    />
                }
            />

            <Collapse in={byPeriod && filterDate} timeout="auto" unmountOnExit>
                <Stack p={1} spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            renderInput={(props) => <TextField {...props} />}
                            label={t('startDate')}
                            inputFormat={"dd/MM/yyyy"}
                            value={startDate}
                            onChange={(newValue) => {
                                setStartDate(newValue);
                                if (moment(newValue).format('DD/MM/yyyy').length == 10 && moment(newValue).isValid()) {
                                    console.log("search checkdate")
                                    dispatch(setFilterCB({
                                        ...filterCB,
                                        start_date: moment(newValue).format('DD/MM/yyyy')
                                    }));
                                }
                            }}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            renderInput={(props) => <TextField {...props} />}
                            label={t('endDate')}
                            inputFormat={"dd/MM/yyyy"}
                            value={endDate}
                            onChange={(newValue) => {
                                setEndDate(newValue);
                                if (moment(newValue).format('DD/MM/yyyy').length == 10 && moment(newValue).isValid()) {
                                    console.log("search checkdate")
                                    dispatch(setFilterCB({
                                        ...filterCB,
                                        end_date: moment(newValue).format('DD/MM/yyyy')
                                    }));
                                }

                            }}
                        />
                    </LocalizationProvider>
                    {moment(startDate).diff(endDate) > 0 && <Typography>start date inf end date</Typography>}
                </Stack>
            </Collapse>
        </Box>
    )
}

export default DateFilter
