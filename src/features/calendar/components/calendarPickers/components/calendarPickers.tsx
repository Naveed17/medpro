import React, {useState} from "react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {configSelector} from "@features/base";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {LocaleFnsProvider} from "@app/localization";
import CalendarPickerStyled from "./overrides/calendarPickerStyled";
import {TextField, useTheme} from "@mui/material";
import {agendaSelector, setCurrentDate} from "@features/calendar";
import moment from "moment-timezone";
import {PickersDay, StaticDatePicker} from "@mui/x-date-pickers";

type CalendarPickerView = "day" | "month" | "year";

function CalendarPickers({...props}) {
    const {notes, disabled} = props;
    const {locale} = useAppSelector(configSelector);
    const {currentDate: initData} = useAppSelector(agendaSelector);
    const dispatch = useAppDispatch();
    const theme = useTheme();

    const [defaultView, setDefaultView] = useState<CalendarPickerView>("day");

    const handleDateChange = (date: Date | null) => {
        if (date) {
            dispatch(setCurrentDate({date, fallback: true}));
        }
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
                    disabled={disabled}
                    renderDay={(day, _value, DayComponentProps) => {
                        const note = notes.find((note: any) => note.date === moment(day).format('DD-MM-YYYY'));
                        const isSelected = !DayComponentProps.outsideCurrentMonth && note;
                        return (
                            <PickersDay {...(isSelected && {
                                sx: {
                                    "&:after": {
                                        background: !(DayComponentProps.today || DayComponentProps.selected) &&
                                            `linear-gradient(to right, 
                                            ${note.events.length > 1 ? theme.palette.secondary.lighter : theme.palette.common.white} 25%, 
                                            ${note.events.length > 3 ? theme.palette.secondary.light : theme.palette.common.white} 25%, 
                                            ${note.events.length > 3 ? theme.palette.secondary.light : theme.palette.common.white} 50%, 
                                            ${note.events.length > 5 ? theme.palette.secondary.dark : theme.palette.common.white} 50%, 
                                            ${note.events.length > 5 ? theme.palette.secondary.dark : theme.palette.common.white} 75%, 
                                            ${note.events.length > 10 ? theme.palette.secondary.darker : theme.palette.common.white} 75%)`,
                                        position: "absolute",
                                        content: '""',
                                        height: "4px",
                                        right: 0,
                                        left: 0,
                                        bottom: 0
                                    },
                                    borderTopRightRadius: !(DayComponentProps.today || DayComponentProps.selected) && " 0 !important",
                                    borderTopLeftRadius: !(DayComponentProps.today || DayComponentProps.selected) && " 0 !important"
                                }
                            })} {...DayComponentProps} />
                        );
                    }}
                    disableOpenPicker
                    minDate={moment("01-01-2018", "DD-MM-YYYY").toDate() as any}
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
