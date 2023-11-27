import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {configSelector, dashLayoutSelector} from "@features/base";
import {LocaleFnsProvider} from "@lib/localization";
import CalendarPickerStyled from "./overrides/calendarPickerStyled";
import {Badge, TextField, useTheme} from "@mui/material";
import {agendaSelector, setCurrentDate} from "@features/calendar";
import moment from "moment-timezone";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider, PickersDay, StaticDatePicker} from "@mui/x-date-pickers";
import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {highlightedDays, useMedicalEntitySuffix} from "@lib/hooks";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

function CalendarPickers({...props}) {
    const {disabled} = props;
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

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

    const handleDateChange = (date: Date | null) => {
        if (date) {
            dispatch(setCurrentDate({date, fallback: true}));
        }
    }

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
                            <Badge
                                key={DayComponentProps.key}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        left: '50%'
                                    }
                                }}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                overlap="circular"
                                badgeContent={!(DayComponentProps.today || DayComponentProps.selected) && note > 0 ?
                                    <FiberManualRecordIcon
                                        sx={{
                                            width: 14,
                                            height: 14,
                                            color: highlightedDays(note, theme)
                                        }}
                                    /> : undefined}>
                                <PickersDay {...DayComponentProps} />
                            </Badge>
                        );
                    }}
                    disableOpenPicker
                    minDate={moment("01-01-2018", "DD-MM-YYYY").toDate() as any}
                    toolbarTitle={""}
                    value={initData.date}
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
