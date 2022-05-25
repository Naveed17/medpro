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
    ToggleButton,
    Tooltip,
    useTheme
} from "@mui/material";
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';

import React from "react";
import {useTranslation} from "next-i18next";
import BadgeStyled from "./badgeStyled";
import AddEventIcon from "@themes/overrides/icons/AddEventIcon";
import CalendarViewDayRoundedIcon from '@mui/icons-material/CalendarViewDayRounded';
import CalendarViewMonthRoundedIcon from '@mui/icons-material/CalendarViewMonthRounded';
import CalendarViewWeekRoundedIcon from '@mui/icons-material/CalendarViewWeekRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';

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

const VIEW_OPTIONS = [
    { value: "dayGridMonth", label: "Month", icon: CalendarViewMonthRoundedIcon },
    { value: "timeGridWeek", label: "Week", icon: CalendarViewWeekRoundedIcon },
    { value: "timeGridDay", label: "Day", icon: CalendarViewDayRoundedIcon },
    { value: "listWeek", label: "Agenda", icon: CalendarTodayRoundedIcon },
];

function CalendarToolbar({ date, ...props }: CalendarToolbarProps){
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
                <Stack direction="row" spacing={1.5}>
                    {VIEW_OPTIONS.map((viewOption) => (
                        <Tooltip key={viewOption.value}
                                 title={viewOption.label}>
                            <ToggleButton
                                value="dayGridMonth"
                                sx={{ width: 37, height: 37, padding: 0, marginTop : '2px!important'}} >
                                <SvgIcon component={viewOption.icon} width={20} height={20} />
                            </ToggleButton>
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
