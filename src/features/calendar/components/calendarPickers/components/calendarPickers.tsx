import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {configSelector} from "@features/base";
import {LocaleFnsProvider} from "@app/localization";
import CalendarPickerStyled from "./overrides/calendarPickerStyled";
import {TextField, useTheme} from "@mui/material";
import {agendaSelector, setCurrentDate} from "@features/calendar";
import moment from "moment-timezone";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {PickersDay, StaticDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {Session} from "next-auth";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

type CalendarPickerView = "day" | "month" | "year";

function CalendarPickers({...props}) {
    const {notes, disabled} = props;
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const {data: session} = useSession();
    const router = useRouter();

    const {locale} = useAppSelector(configSelector);
    const {currentDate: initData, config: agendaConfig} = useAppSelector(agendaSelector);

    const [defaultView, setDefaultView] = useState<CalendarPickerView>("day");
    const [startOfMonth, setStartOfMonth] = useState(moment(initData.date).startOf('month').format('DD-MM-YYYY'));
    const [endOfMonth, setEndOfMonth] = useState(moment(initData.date).endOf('month').format('DD-MM-YYYY'));

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpAppCountResponse} = useRequest(
        agendaConfig ?
            {
                method: "GET",
                url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agendaConfig.uuid}/appointments/count/${router.locale}?start_date=${startOfMonth}&end_date=${endOfMonth}&format=week`,
                headers: {Authorization: `Bearer ${session?.accessToken}`},
            } : null,
        SWRNoValidateConfig
    );

    const handleDateChange = (date: Date | null) => {
        if (date) {
            dispatch(setCurrentDate({date, fallback: true}));
        }
    }

    const onYearChange = (year: any) => {
        setDefaultView("day");
    };

    const appointmentDayCount = (httpAppCountResponse as HttpResponse)?.data;

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
                        const note = appointmentDayCount && appointmentDayCount[moment(day).format('DD-MM-YYYY')];
                        const isSelected = !DayComponentProps.outsideCurrentMonth && note;
                        return (
                            <PickersDay {...(isSelected && {
                                sx: {
                                    "&:after": {
                                        background: !(DayComponentProps.today || DayComponentProps.selected) &&
                                            `linear-gradient(to right,
                                            ${note >= 1 ? theme.palette.secondary.lighter : theme.palette.common.white} 25%,
                                            ${note > 3 ? theme.palette.secondary.light : theme.palette.common.white} 25%,
                                            ${note > 3 ? theme.palette.secondary.light : theme.palette.common.white} 50%,
                                            ${note > 5 ? theme.palette.secondary.dark : theme.palette.common.white} 50%,
                                            ${note > 5 ? theme.palette.secondary.dark : theme.palette.common.white} 75%,
                                            ${note > 10 ? theme.palette.secondary.darker : theme.palette.common.white} 75%)`,
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
                    onMonthChange={date => {
                        setStartOfMonth(moment(date).startOf('month').format('DD-MM-YYYY'));
                        setEndOfMonth(moment(date).endOf('month').format('DD-MM-YYYY'));
                    }}
                    onViewChange={(view: CalendarPickerView) => setDefaultView(view)}
                    onYearChange={onYearChange}
                />
            </LocalizationProvider>
        </CalendarPickerStyled>
    );
}

export default CalendarPickers;
