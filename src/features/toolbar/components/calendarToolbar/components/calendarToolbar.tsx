import {RootStyled} from "@features/toolbar";
import {
    Box,
    Button,
    Hidden,
    IconButton,
    Stack,
    SvgIcon, Theme,
    Tooltip, Typography, useMediaQuery,
    useTheme
} from "@mui/material";

import React from "react";
import {useTranslation} from "next-i18next";
import TodayIcon from "@themes/overrides/icons/todayIcon";
import DayIcon from "@themes/overrides/icons/dayIcon";
import WeekIcon from "@themes/overrides/icons/weekIcon";
import GridIcon from "@themes/overrides/icons/gridIcon";
import ToggleButtonStyled from "./overrides/toggleButtonStyled";
import CalendarIcon from "@themes/overrides/icons/calendarIcon";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {agendaSelector, setView} from "@features/calendar";
import Zoom from '@mui/material/Zoom';
import moment from "moment-timezone";
import {CalendarViewButton, CalendarAddButton} from "@features/buttons";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function CalendarToolbar({...props}) {
    const {OnToday, OnAddAppointment, OnClickDatePrev, OnClickDateNext} = props;
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    const isRTL = theme.direction === "rtl";

    const {view, currentDate} = useAppSelector(agendaSelector);

    const VIEW_OPTIONS = [
        {value: "timeGridDay", label: "Day", text: "Jour", icon: TodayIcon},
        {value: "timeGridWeek", label: "Weeks", text: "Semaine", icon: DayIcon},
        {value: "dayGridMonth", label: "Months", text: "Mois", icon: WeekIcon},
        {value: "listWeek", label: "Agenda", text: "List", icon: GridIcon}
    ];

    const handleViewChange = (view: string) => {
        dispatch(setView(view));
    }

    const {t, ready} = useTranslation('agenda');
    if (!ready) return (<>loading translations...</>);

    return (
        <RootStyled {...props}>
            <Box>
                <Hidden smDown>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center"
                    }}>
                        <Tooltip title={t("today", {ns: "common"})} TransitionComponent={Zoom}>
                            <IconButton
                                onClick={OnToday}
                                aria-label="Calendar"
                                sx={{border: "1px solid", mr: 1, color: "primary.main"}}>
                                <CalendarIcon/>
                            </IconButton>
                        </Tooltip>

                        {!isMobile && <Box
                            className="action-header-main"
                            sx={{
                                "& .MuiSvgIcon-root": {
                                    width: 16,
                                    height: 16
                                },
                                svg: {
                                    transform: isRTL ? "rotate(180deg)" : "rotate(0deg)",
                                },
                            }}
                        >
                            <IconButton
                                onClick={OnClickDatePrev}
                                aria-label="back"
                            >
                                <ArrowBackIosNewIcon fontSize="small"/>
                            </IconButton>
                            <IconButton
                                onClick={OnClickDateNext}
                                aria-label="next"
                            >
                                <ArrowForwardIosIcon fontSize="small"/>
                            </IconButton>
                        </Box>}

                        <Button className="Current-date" variant="text-transparent">
                            <Typography variant="body2" component={"span"}>
                                {moment(currentDate.date).format(view === 'dayGridMonth' || view === 'timeGridWeek' ? 'MMMM, YYYY' : 'Do MMMM, YYYY')}
                            </Typography>
                        </Button>
                    </Box>
                </Hidden>

                <Hidden smUp>
                    <Button className="Current-date"
                            sx={{
                                position: "absolute",
                                top: "0.6rem",
                                left: "0.5rem"
                            }}
                            variant="text-transparent">
                        <Typography variant="body2" component={"span"}>
                            {moment(currentDate.date).format(view === 'dayGridMonth' || view === 'timeGridWeek' ? 'MMMM' : 'Do MMMM')}
                        </Typography>
                    </Button>
                </Hidden>
            </Box>

            <Hidden smUp>
                <Stack direction="row" spacing={1.5} justifyContent={"flex-end"} sx={{margin: "0.5rem 0"}}>
                    <CalendarViewButton
                        {...{view}}
                        sx={{
                            "& .MuiButton-startIcon>*:nth-of-type(1)": {
                                fontSize: 20
                            }
                        }}
                        views={VIEW_OPTIONS}
                        onSelect={(viewOption: string) => viewOption !== "listWeek" && handleViewChange(viewOption)}
                    />

                    <CalendarAddButton
                        sx={{
                            padding: "8px",
                            "& .MuiButton-startIcon": {
                                margin: 0
                            },
                            "& .MuiButton-startIcon>*:nth-of-type(1)": {
                                fontSize: 16
                            }
                        }}
                        onClickEvent={OnAddAppointment}
                    />
                </Stack>
            </Hidden>
            <Hidden smDown>
                <Stack direction="row" spacing={1.5}>
                    {VIEW_OPTIONS.map((viewOption) => (
                        <Tooltip key={viewOption.value}
                                 TransitionComponent={Zoom}
                                 onClick={() => handleViewChange(viewOption.value)}
                                 title={t(`times.${viewOption.label.toLowerCase()}`, {ns: "common"})}>
                            <ToggleButtonStyled
                                value="dayGridMonth"
                                sx={{
                                    width: 37, height: 37, padding: 0, marginTop: '2px!important',
                                    ...(viewOption.value === view && {background: theme.palette.primary.main})
                                }}>
                                <SvgIcon component={viewOption.icon} width={20} height={20}
                                         htmlColor={viewOption.value === view ? theme.palette.background.paper : theme.palette.text.primary}/>
                            </ToggleButtonStyled>
                        </Tooltip>
                    ))}
                    <CalendarAddButton
                        {...{t}}
                        onClickEvent={OnAddAppointment}
                    />
                </Stack>
            </Hidden>
        </RootStyled>
    );
}

export default CalendarToolbar;
