import React, {useState} from "react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {configSelector} from "@features/base";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {LocaleFnsProvider} from "@app/localization/localization";
import CalendarPickerStyled from "./overrides/calendarPickerStyled";
import {Badge, TextField, useTheme} from "@mui/material";
import {StaticDatePicker} from '@mui/x-date-pickers/StaticDatePicker';
import {agendaSelector, setCurrentDate} from "@features/calendar";
import moment from "moment-timezone";
import {PickersDay} from "@mui/x-date-pickers";

type CalendarPickerView = "day" | "month" | "year";

function CalendarPickers({...props}) {
    const {notes} = props;
    const {locale} = useAppSelector(configSelector);
    const {currentDate: initData} = useAppSelector(agendaSelector);
    const dispatch = useAppDispatch();
    const theme = useTheme();

    const [defaultView, setDefaultView] = useState<CalendarPickerView>("day");

    const handleDateChange = (date: Date) => {
        dispatch(setCurrentDate({date, fallback: true}));
    }
    const onYearChange = (year: any) => {
        setDefaultView("day");
    };

    return (
        <CalendarPickerStyled>
            <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={LocaleFnsProvider(locale)}
            >
                <StaticDatePicker
                    {...props}
                    renderDay={(day, _value, DayComponentProps) => {
                        const isSelected =
                            !DayComponentProps.outsideCurrentMonth &&
                            notes.find((note: any) => note.date === moment(day).format('DD-MM-YYYY'));

                        return (
                            <PickersDay {...(isSelected && {sx: {backgroundColor: theme.palette.error.light}})} {...DayComponentProps} />
                        );
                    }}
                    disableOpenPicker
                    toolbarTitle={""}
                    value={initData.date}
                    renderInput={(params) => <TextField {...params} />}
                    displayStaticWrapperAs="desktop"
                    onChange={(date) => handleDateChange(date)}
                    onViewChange={(view: CalendarPickerView) => setDefaultView(view)}
                    onYearChange={onYearChange}
                />
            </LocalizationProvider>
        </CalendarPickerStyled>
    );
}

export default CalendarPickers;
