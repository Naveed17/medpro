import {useState} from "react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {configSelector} from "@features/base";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {LocaleFnsProvider} from "@app/localization/localization";
import CalendarPickerStyled from "./overrides/calendarPickerStyled";
import {TextField} from "@mui/material";
import {StaticDatePicker} from '@mui/x-date-pickers/StaticDatePicker';
import {agendaSelector, setCurrentDate} from "@features/calendar";

type CalendarPickerView = "day" | "month" | "year";

function CalendarPickers({...props}) {
    const {locale} = useAppSelector(configSelector);
    const {currentDate: initData} = useAppSelector(agendaSelector);
    const dispatch = useAppDispatch();

    const [date, setDate] = useState(initData);
    const [defaultView, setDefaultView] = useState<CalendarPickerView>("day");

    const handleDateChange = (date: Date) => {
        setDate(date);
        dispatch(setCurrentDate(date));
    }
    const onYearChange = (year: any) => {
        setDefaultView("day");
    };

    return (
        <CalendarPickerStyled>
            <LocalizationProvider
                {...props}
                dateAdapter={AdapterDateFns}
                locale={LocaleFnsProvider(locale)}
            >
                <StaticDatePicker
                    disablePast
                    disableOpenPicker
                    toolbarTitle={""}
                    value={date}
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
