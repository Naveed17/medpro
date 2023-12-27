import React, {useCallback, useState} from "react";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {configSelector, dashLayoutSelector} from "@features/base";
import {LocaleFnsProvider} from "@lib/localization";
import CalendarPickerStyled from "./overrides/calendarPickerStyled";
import {Stack, TextField, Typography, useMediaQuery, useTheme} from "@mui/material";
import {agendaSelector} from "@features/calendar";
import moment from "moment-timezone";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider, PickersDay, StaticDatePicker} from "@mui/x-date-pickers";
import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {highlightedDays, useMedicalEntitySuffix} from "@lib/hooks";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {MobileContainer as smallScreen} from "@lib/constants";

function CalendarPickers({...props}) {
    const {disabled, onDateChange, defaultValue = null} = props;
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const isMobile = useMediaQuery(`(max-width:${smallScreen}px)`);

    const {locale} = useAppSelector(configSelector);
    const {currentDate: initData, config: agendaConfig} = useAppSelector(agendaSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [startOfMonth, setStartOfMonth] = useState(moment(initData.date).startOf('month').format('DD-MM-YYYY'));
    const [endOfMonth, setEndOfMonth] = useState(moment(initData.date).endOf('month').format('DD-MM-YYYY'));

    const {data: httpAppCountResponse} = useRequestQuery(medicalEntityHasUser && agendaConfig ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/agendas/${agendaConfig.uuid}/appointments/count/${router.locale}`
    } : null, {
        ...ReactQueryNoValidateConfig,
        ...((medicalEntityHasUser && agendaConfig) && {variables: {query: `?start_date=${startOfMonth}&end_date=${endOfMonth}&format=week`}})
    });

    const handleDateChange = useCallback((date: Date | null) => {
        onDateChange(date);
    }, [onDateChange])

    const appointmentDayCount = (httpAppCountResponse as HttpResponse)?.data;

    return (
        <CalendarPickerStyled>
            <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={LocaleFnsProvider(locale)}>
                <StaticDatePicker
                    {...props}
                    disabled={disabled}
                    renderDay={(day, _value, DayComponentProps) => {
                        const note = appointmentDayCount && appointmentDayCount[moment(day).format('DD-MM-YYYY')];
                        return (
                            <PickersDay {...DayComponentProps}>
                                <Stack alignItems={"center"} justifyContent={"center"} spacing={0} m={isMobile ? 0 : 2}>
                                    <Typography fontSize={12} fontWeight={600}>{day.getDate()}</Typography>
                                    {!(DayComponentProps.today || DayComponentProps.selected) && note > 0 ?
                                        <FiberManualRecordIcon
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                width: 10,
                                                height: 10,
                                                color: highlightedDays(note, theme)
                                            }}
                                        /> : undefined}
                                </Stack>
                            </PickersDay>
                        );
                    }}
                    disableOpenPicker
                    minDate={moment("01-01-2018", "DD-MM-YYYY").toDate() as any}
                    toolbarTitle={""}
                    value={defaultValue ? defaultValue : initData.date}
                    renderInput={(params) => <TextField {...params} />}
                    displayStaticWrapperAs="desktop"
                    onChange={(date) => handleDateChange(date)}
                    onMonthChange={date => {
                        setStartOfMonth(moment(date).startOf('month').format('DD-MM-YYYY'));
                        setEndOfMonth(moment(date).endOf('month').format('DD-MM-YYYY'));
                    }}
                />
            </LocalizationProvider>
        </CalendarPickerStyled>
    );
}

export default CalendarPickers;
