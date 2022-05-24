import PropTypes from "prop-types";
import {RootStyled} from "@features/calendarToolbar";
import {Badge, Box, Button, IconButton} from "@mui/material";
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';

import React from "react";
import {useTranslation} from "next-i18next";
import BadgeStyled from "./badgeStyled";

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

    const { t, ready } = useTranslation('agenda');
    if (!ready) return (<>loading translations...</>);

    return(
        <RootStyled {...props}>
            <Box>
                <IconButton
                    aria-label="Calendar"
                    sx={{ border: "1px solid #1976d2", mr: 1, color: "primary.main" }}
                >
                    <TodayRoundedIcon />
                </IconButton>
                <Button
                    startIcon={<HourglassBottomRoundedIcon />}
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: "capitalize" }}>

                    <BadgeStyled badgeContent={2}>
                        {t("pending")}
                    </BadgeStyled>
                </Button>
            </Box>
        </RootStyled>
    );
}

export default CalendarToolbar;
