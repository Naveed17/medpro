import {Box, Checkbox, Collapse, FormControlLabel, Stack, TextField} from "@mui/material";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import React, {useState} from "react";
import {useTranslation} from "next-i18next";

function DateFilter({...props}) {

    const {filterDate, setFilterDate,byPeriod,setByPeriod} = props;
    const {t} = useTranslation('payment', {keyPrefix: 'filter'});

    return (
        <Box>
            <FormControlLabel
                label={`${t('filterByDate')}`}
                control={
                    <Checkbox
                        checked={filterDate}
                        onChange={() => {
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
                            value={new Date()}
                            onChange={(newValue) => {
                                //setValue(newValue);
                            }}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            renderInput={(props) => <TextField {...props} />}
                            label={t('endDate')}
                            value={new Date()}
                            onChange={(newValue) => {
                                //setValue(newValue);
                            }}
                        />
                    </LocalizationProvider>
                </Stack>
            </Collapse>
        </Box>
    )
}

export default DateFilter
