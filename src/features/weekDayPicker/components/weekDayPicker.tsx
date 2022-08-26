import React, {useState} from "react";
import {Box, Typography, IconButton, Container, Divider} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import WeekDayPickerStyled from './overrides/weekDayPickerStyled';
import moment from "moment";

const months: String[] = [];

function WeekDayPicker({...props}) {
    const {date: initDate, onChange} = props;
    const offsetYearWeek = moment(initDate).week() - moment().week();
    const [currentWeek, setWeek] = useState([offsetYearWeek, offsetYearWeek + 7]);
    const clonedDate = new Date(initDate.getTime());
    const [date, setDate] = useState<Date>(new Date(clonedDate.setHours(0, 0, 0, 0)));

    const now = new Date();
    let daysOfYear = [];
    for (
        let d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        d <= new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        d.setDate(d.getDate() + 1)
    ) {
        daysOfYear.push(new Date(d));
    }

    const getMonths = () => {
        Array.from(Array(12).keys()).map(index =>
            months.push(moment().set('month', index).format("MMMM")))
    }

    const handleDateChange = (date: Date) => {
        setDate(date);
        onChange(date);
    }

    getMonths();

    console.log("currentWeek", currentWeek);

    return (
        <WeekDayPickerStyled>
            <Container>
                <Box className="header">
                    <Typography variant="h6" color="primary.main">
                        {months[daysOfYear[currentWeek[1] - 1].getMonth()]}{" "}
                        {daysOfYear[currentWeek[1] - 1].getFullYear()}
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
                    {daysOfYear.slice(currentWeek[0], currentWeek[1]).map((v, i) => (
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
                                variant="body2"
                                color={
                                    date.getTime() === v.getTime()
                                        ? "warning.contrastText"
                                        : "text.primary"
                                }
                                pb={1}
                            >
                                {v.toString().slice(0, 3)}
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
