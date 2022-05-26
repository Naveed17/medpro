import PropTypes from "prop-types";
import {ButtonBadgeStyled, RootStyled} from "@features/calendarToolbar";
import {
    Badge,
    Box,
    Button,
    Hidden,
    Icon,
    IconButton,
    Stack,
    SvgIcon,
    ToggleButton, ToggleButtonGroup,
    Tooltip,
    useTheme
} from "@mui/material";
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';

import React from "react";
import {useTranslation} from "next-i18next";
import BadgeStyled from "./badgeStyled";
import CalendarViewDayRoundedIcon from '@mui/icons-material/CalendarViewDayRounded';
import CalendarViewMonthRoundedIcon from '@mui/icons-material/CalendarViewMonthRounded';
import CalendarViewWeekRoundedIcon from '@mui/icons-material/CalendarViewWeekRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import TodayIcon from "@themes/overrides/icons/todayIcon";
import AddEventIcon from "@themes/overrides/icons/addEventIcon";
import DayIcon from "@themes/overrides/icons/dayIcon";
import WeekIcon from "@themes/overrides/icons/weekIcon";
import GridIcon from "@themes/overrides/icons/gridIcon";
import ToggleButtonStyled from "./toggleButtonStyled";

CalendarToolbar.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    onToday: PropTypes.func,
    onNextDate: PropTypes.func,
    onPrevDate: PropTypes.func,
    onChangeView: PropTypes.func,
    view: PropTypes.oneOf([
        "dayGridMonth",
        "timeGridWeek",
        "timeGridDay",
        "listWeek",
    ]),
};

type CalendarToolbarProps = {
    date: Date
};



function CalendarToolbar({ date, ...props }: CalendarToolbarProps){
    const theme = useTheme();
    const VIEW_OPTIONS = [
        { value: "dayGridMonth", label: "Month", icon: GridIcon , color: theme.palette.primary.main },
        { value: "timeGridWeek", label: "Week", icon: WeekIcon },
        { value: "timeGridDay", label: "Day", icon: DayIcon },
        { value: "listWeek", label: "Agenda", icon: TodayIcon },
    ];

    const { t, ready } = useTranslation('agenda');
    if (!ready) return (<>loading translations...</>);

    return(
        <RootStyled {...props}>
            <Box>
                <Hidden smDown>
                    <IconButton
                        aria-label="Calendar"
                        sx={{ border: "1px solid #1976d2", mr: 1, color: "primary.main" }}>
                        <TodayRoundedIcon />
                    </IconButton>
                    <Button
                        startIcon={<HourglassBottomRoundedIcon />}
                        variant="contained"
                        color="primary"
                        sx={{ textTransform: "capitalize", paddingRight: 2.4 }}>
                        <BadgeStyled badgeContent={2}>
                            {t("pending")}
                        </BadgeStyled>
                    </Button>
                </Hidden>

                <Hidden smUp>
                    <ButtonBadgeStyled
                        variant="contained"
                        color="primary">
                        <Badge badgeContent={2} color="secondary">
                            <HourglassBottomRoundedIcon />
                        </Badge>
                    </ButtonBadgeStyled>
                </Hidden>
            </Box>
            <Hidden smDown>
                {/*{...(viewOption.color !== undefined  && {  })}*/}
                <Stack direction="row" spacing={1.5}>
                    {VIEW_OPTIONS.map((viewOption) => (
                        <Tooltip key={viewOption.value}
                                 title={viewOption.label}>
                                <ToggleButtonStyled
                                    value="dayGridMonth"
                                    sx={{ width: 37, height: 37, padding: 0, marginTop : '2px!important' ,
                                        ...(viewOption.color !== undefined  && { background : viewOption.color })}} >
                                    <SvgIcon component={viewOption.icon}  width={20} height={20} />
                                </ToggleButtonStyled>
                        </Tooltip>
                    ))}
                    <Button
                        startIcon={<AddEventIcon />}
                        variant="contained"
                        color="warning">
                        {t("add")}
                    </Button>
                </Stack>
            </Hidden>
        </RootStyled>
    );
}

export default CalendarToolbar;
