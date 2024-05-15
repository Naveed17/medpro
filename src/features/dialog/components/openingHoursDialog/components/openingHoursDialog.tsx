import {FormHelperText, TextField, Typography} from "@mui/material";
import React from "react";
import {DatePicker} from "@mui/x-date-pickers";
import moment from "moment";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {dialogOpeningHoursSelector, setOpeningData} from "@features/dialog";
import OpeningHoursDialogStyled from "./overrides/openingHoursDialogStyled";

function OpeningHoursDialog({...props}) {
    const {t} = props.data;
    const dispatch = useAppDispatch();

    const {endDate, startDate, name} = useAppSelector(dialogOpeningHoursSelector);

    return (
        <OpeningHoursDialogStyled p={1} spacing={2}>
            <Typography>{t('lieux.new.hours-schedule-name')}</Typography>
            <TextField
                fullWidth
                id={"opening-hours-name"}
                placeholder={t('lieux.new.hours-schedule-slots')}
                size="small"
                onChange={(ev) => {
                    dispatch(setOpeningData({name: ev.target.value}));
                }}
                value={name}
                sx={{marginTop: 2, marginBottom: 5}}/>

            <Typography>{t('lieux.new.date-range')}</Typography>

            <DatePicker
                openTo="month"
                views={['year', 'month', 'day']}
                label={t('lieux.new.startDate')}
                format={"dd/MM/yyyy"}
                value={startDate}
                onChange={(newValue) => {
                    dispatch(setOpeningData({startDate: newValue as Date}));
                }}
            />

            <DatePicker
                openTo="month"
                views={['year', 'month', 'day']}
                label={t('lieux.new.endDate')}
                format={"dd/MM/yyyy"}
                value={endDate}
                onChange={(newValue) => {
                    dispatch(setOpeningData({endDate: newValue as Date}));
                }}
            />

            {moment(startDate).diff(endDate) > 0 && <FormHelperText error sx={{px: 2, mx: 0}}>
                {t('lieux.new.date-error')}
            </FormHelperText>}
        </OpeningHoursDialogStyled>
    )
}

export default OpeningHoursDialog
