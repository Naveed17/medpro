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
import {useMedicalEntitySuffix} from "@lib/hooks";
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

    const highlightedDays = (note: number) => {
        return note >= 1 ? theme.palette.secondary.lighter :
            note > 3 ? theme.palette.secondary.light :
                note > 5 ? theme.palette.secondary.dark :
                    note > 10 ? theme.palette.secondary.darker : undefined;
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
                        const isSelected = !DayComponentProps.outsideCurrentMonth && note;
                        return (
                            <Badge
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
                                badgeContent={!(DayComponentProps.today || DayComponentProps.selected) ?
                                    <FiberManualRecordIcon
                                        sx={{
                                            width: 14,
                                            height: 14,
                                            color: highlightedDays(note)
                                        }}
                                    /> : undefined}>
                                <PickersDay {...(isSelected && {
                                    sx: {
                                        "&:after": {
                                            /*   background: !(DayComponentProps.today || DayComponentProps.selected) &&
                                                   `linear-gradient(to right,
                                                   ${note >= 1 ? theme.palette.secondary.lighter : theme.palette.common.white} 25%,
                                                   ${note > 3 ? theme.palette.secondary.light : theme.palette.common.white} 25%,
                                                   ${note > 3 ? theme.palette.secondary.light : theme.palette.common.white} 50%,
                                                   ${note > 5 ? theme.palette.secondary.dark : theme.palette.common.white} 50%,
                                                   ${note > 5 ? theme.palette.secondary.dark : theme.palette.common.white} 75%,
                                                   ${note > 10 ? theme.palette.secondary.darker : theme.palette.common.white} 75%)`,*/
                                            position: "absolute",
                                            content: "''",
                                            height: "4px",
                                            right: 0,
                                            left: 0,
                                            bottom: 0
                                        },
                                        borderTopRightRadius: !(DayComponentProps.today || DayComponentProps.selected) && " 0 !important",
                                        borderTopLeftRadius: !(DayComponentProps.today || DayComponentProps.selected) && " 0 !important"
                                    }
                                })} {...DayComponentProps} />
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
