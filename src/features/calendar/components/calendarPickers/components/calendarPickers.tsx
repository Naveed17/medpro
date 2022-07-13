import { useState } from "react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { useAppSelector } from "@app/redux/hooks";
import { configSelector } from "@features/base";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { LocaleFnsProvider } from "@app/localization/localization";
import CalendarPickerStyled from "./overrides/calendarPickerStyled";
import { TextField } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";

type CalendarPickerView = "day" | "month" | "year";

function CalendarPickers({ props }: any) {
  const [currentDay, setCurrentDay] = useState(new Date());
  const [defaultView, setDefaultView] = useState<CalendarPickerView>("day");
  const { locale } = useAppSelector(configSelector);
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
          value={currentDay}
          renderInput={(params) => <TextField {...params} />}
          displayStaticWrapperAs="desktop"
          onChange={(newDate: any) => setCurrentDay(newDate)}
          onViewChange={(view: CalendarPickerView) => setDefaultView(view)}
          onYearChange={onYearChange}
        />
      </LocalizationProvider>
    </CalendarPickerStyled>
  );
}

export default CalendarPickers;
