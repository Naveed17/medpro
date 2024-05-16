import React, {useCallback, useState} from "react";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import CalendarPickerStyled from "./overrides/calendarPickerStyled";
import {Divider, IconButton, Stack, Theme, Typography, useMediaQuery, useTheme} from "@mui/material";
import {agendaSelector} from "@features/calendar";
import moment from "moment-timezone";
import {
    PickersCalendarHeaderProps,
    PickersDay,
    PickersDayProps,
    StaticDatePicker
} from "@mui/x-date-pickers";
import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {highlightedDays, useMedicalEntitySuffix} from "@lib/hooks";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {MobileContainer as smallScreen} from "@lib/constants";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import {styled} from '@mui/material/styles';
import {startCase} from "lodash";

function CustomPickersDay(props: PickersDayProps<any> & {
    day_count?: any,
    is_mobile: boolean,
    theme: Theme
}) {
    const {day_count, is_mobile, theme, day, today, selected} = props;
    const note = day_count && day_count[moment(day).format('DD-MM-YYYY')];
    return (
        <PickersDay {...props}>
            <Stack alignItems={"center"} justifyContent={"center"} spacing={0} m={Boolean(is_mobile) ? 0 : 2}>
                <Typography fontSize={12} fontWeight={600}>{day.getDate()}</Typography>
                {!(today || selected) && note > 0 ?
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
    )
}

const CustomCalendarHeaderRoot = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 16px',
    alignItems: 'center',
});

function CustomCalendarHeader(props: PickersCalendarHeaderProps<any>) {
    const {currentMonth, onMonthChange} = props;
    const currentMonthMoment = moment(currentMonth);

    const selectNextMonth = () => onMonthChange(currentMonthMoment.add(1, 'month').toDate(), 'left');
    const selectPreviousMonth = () => onMonthChange(currentMonthMoment.subtract(1, 'month').toDate(), 'right');

    return (
        <Stack>
            <CustomCalendarHeaderRoot>
                <Stack spacing={1} direction="row">
                    <IconButton onClick={selectPreviousMonth} title="Previous month">
                        <ChevronLeft color="text" sx={{mr: 'auto', color: "text.secondary"}}/>
                    </IconButton>
                </Stack>
                <Typography variant="body2"
                            fontSize={20}>{startCase(currentMonthMoment.format('MMM YYYY'))}</Typography>
                <Stack spacing={1} direction="row">
                    <IconButton onClick={selectNextMonth} title="Next month">
                        <ChevronRight color="text" sx={{ml: 'auto', color: "text.secondary"}}/>
                    </IconButton>
                </Stack>
            </CustomCalendarHeaderRoot>
            <Divider sx={{pb: .3}}/>
        </Stack>

    );
}

function CalendarPickers({...props}) {
    const {disabled, onDateChange, defaultValue = null} = props;
    const theme = useTheme();
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const isMobile = useMediaQuery(`(max-width:${smallScreen}px)`);

    const {currentDate: initData, config: agendaConfig} = useAppSelector(agendaSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [startOfMonth, setStartOfMonth] = useState(moment(initData.date).startOf('month').format('DD-MM-YYYY'));
    const [endOfMonth, setEndOfMonth] = useState(moment(initData.date).endOf('month').format('DD-MM-YYYY'));

    const {data: httpAppCountResponse} = useRequestQuery(medicalEntityHasUser && agendaConfig?.uuid ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/agendas/${agendaConfig.uuid}/appointments/count/${router.locale}`
    } : null, {
        ...ReactQueryNoValidateConfig,
        ...((medicalEntityHasUser && agendaConfig?.uuid) && {variables: {query: `?start_date=${startOfMonth}&end_date=${endOfMonth}&format=week`}})
    });

    const handleDateChange = useCallback((date: Date | null) => {
        onDateChange(date);
    }, [onDateChange])

    const appointmentDayCount = (httpAppCountResponse as HttpResponse)?.data;

    return (
        <CalendarPickerStyled>
            <StaticDatePicker
                {...props}
                disabled={disabled}
                displayStaticWrapperAs="desktop"
                slots={{
                    day: CustomPickersDay as any,
                    calendarHeader: CustomCalendarHeader
                }}
                slotProps={{
                    day: {day_count: appointmentDayCount, is_mobile: isMobile.toString(), theme} as any,
                    calendarHeader: {sx: {border: '1px red solid'}}
                }}
                minDate={moment("01-01-2018", "DD-MM-YYYY").toDate() as any}
                value={defaultValue ? defaultValue : moment(initData.date).toDate()}
                onChange={(date) => handleDateChange(date)}
                onMonthChange={date => {
                    setStartOfMonth(moment(date).startOf('month').format('DD-MM-YYYY'));
                    setEndOfMonth(moment(date).endOf('month').format('DD-MM-YYYY'));
                }}

            />
        </CalendarPickerStyled>
    );
}

export default CalendarPickers;
