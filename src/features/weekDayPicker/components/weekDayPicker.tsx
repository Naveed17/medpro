import React, {useCallback, useEffect, useState} from "react";
import {Box, Typography, IconButton, Container, Divider} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import WeekDayPickerStyled from './overrides/weekDayPickerStyled';
import moment, {Moment} from "moment-timezone";

const months: String[] = [];

function WeekDayPicker({...props}) {
    const {date: initDate, action, onChange} = props;

    const [offsetYearWeekStart] = useState(action === "reschedule" ? 0 : initDate?.week() - moment().week());
    const [offsetYearWeekEnd] = useState(offsetYearWeekStart + 1);
    const [currentWeek, setWeek] = useState([offsetYearWeekStart * 7, offsetYearWeekEnd * 7]);
    const clonedDate = action === "reschedule" ? new Date() : initDate?.toDate();
    const [date, setDate] = useState<Date>(new Date(clonedDate.setHours(0, 0, 0, 0)));
    const [daysOfYear, setDaysOfYear] = useState<Date[]>([]);

    const getMonths = () => {
        Array.from(Array(12).keys()).forEach(index =>
            months.push(moment().set('month', index).format("MMMM")))
    }

    const onChangeCallback = useCallback((date: Moment) => {
        onChange(date);
    }, [onChange]);

    const handleDateChange = (date: Date) => {
        setDate(date);
        onChangeCallback(moment(date));
    }

    useEffect(() => {
        getMonths();
        const now = moment().startOf('week').toDate();
        let daysOfYear = [];
        for (
            let d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            d <= new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
            d.setDate(d.getDate() + 1)
        ) {
            daysOfYear.push(new Date(d));
        }
        setDaysOfYear(daysOfYear);
    }, [action]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <WeekDayPickerStyled>
            <Container>
                <Box className="header">
                    <Typography variant="h6" color="primary.main">
                        {months[daysOfYear[currentWeek[1] - 1]?.getMonth()]}{" "}
                        {daysOfYear[currentWeek[1] - 1]?.getFullYear()}
                    </Typography>
                    <div>
                        <IconButton
                            onClick={() => setWeek([currentWeek[0] - 7, currentWeek[1] - 7])}
                            size="small"
                            disabled={currentWeek[0] <= 0}
                            color="primary"
                            className="arrow-back"
                        >
                            <ArrowBackIosNewIcon fontSize="small"/>
                        </IconButton>
                        <IconButton
                            onClick={() => setWeek([currentWeek[0] + 7, currentWeek[1] + 7])}
                            size="small"
                            color="primary"
                        >
                            <ArrowForwardIosIcon fontSize="small"/>
                        </IconButton>
                    </div>
                </Box>
                <Divider/>
                <Box className="week-days">
                    {daysOfYear.slice(currentWeek[0], currentWeek[1]).map((v) => (
                        <Box
                            key={Math.random()}
                            sx={{
                                bgcolor: date.getTime() === v.getTime() ? "warning.main" : "",
                                "&:hover": {
                                    bgcolor:
                                        date.getTime() === v.getTime()
                                            ? "warning.main"
                                            : "divider",
                                },
                            }}
                            className="day"
                            onClick={() => handleDateChange(v)}
                        >
                            <Typography
                                sx={{textTransform: "capitalize"}}
                                variant="body2"
                                color={
                                    date.getTime() === v.getTime()
                                        ? "warning.contrastText"
                                        : "text.primary"
                                }
                                pb={1}
                            >
                                {moment(v).format("ddd").replace(".", "")}
                            </Typography>
                            <Typography
                                variant="body2"
                                color={
                                    date.getTime() === v.getTime()
                                        ? "warning.contrastText"
                                        : "text.primary"
                                }
                            >
                                {v.getDate()}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>
        </WeekDayPickerStyled>
    );
}

export default WeekDayPicker;
