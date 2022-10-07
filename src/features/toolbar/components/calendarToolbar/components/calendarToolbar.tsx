import PropTypes from "prop-types";
import {RootStyled} from "@features/toolbar";
import {
    Box,
    Button,
    Hidden,
    IconButton,
    Stack,
    SvgIcon,
    Tooltip, Typography,
    useTheme
} from "@mui/material";

import React from "react";
import {useTranslation} from "next-i18next";
import TodayIcon from "@themes/overrides/icons/todayIcon";
import AddEventIcon from "@themes/overrides/icons/addEventIcon";
import DayIcon from "@themes/overrides/icons/dayIcon";
import WeekIcon from "@themes/overrides/icons/weekIcon";
import GridIcon from "@themes/overrides/icons/gridIcon";
import ToggleButtonStyled from "./overrides/toggleButtonStyled";
import CalendarIcon from "@themes/overrides/icons/calendarIcon";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {agendaSelector, openDrawer, setView} from "@features/calendar";
import Zoom from '@mui/material/Zoom';
import moment from "moment-timezone";
import {CalendarViewButton, CalendarAddButton} from "@features/buttons";

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
    onToday: React.EventHandler<any>
};

function CalendarToolbar({date, onToday, ...props}: CalendarToolbarProps) {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const {view, currentDate} = useAppSelector(agendaSelector);

    const VIEW_OPTIONS = [
        {value: "timeGridDay", label: "Day", icon: TodayIcon},
        {value: "timeGridWeek", label: "Weeks", icon: DayIcon},
        {value: "dayGridMonth", label: "Months", icon: WeekIcon},
        {value: "listWeek", label: "Agenda", icon: GridIcon},
        // {value: "export", label: "Export", icon: ExportEventIcon},
    ];

    const handleViewChagne = (view: string) => {
        dispatch(setView(view))
    }

    const {t, ready} = useTranslation('agenda');
    if (!ready) return (<>loading translations...</>);

    return (
        <RootStyled {...props}>
            <Box>
                <Hidden smDown>
                    <Tooltip title={t("today", {ns: "common"})} TransitionComponent={Zoom}>
                        <IconButton
                            onClick={onToday}
                            aria-label="Calendar"
                            sx={{border: "1px solid", mr: 1, color: "primary.main"}}>
                            <CalendarIcon/>
                        </IconButton>
                    </Tooltip>

                    <Button className="Current-date" variant="text-transparent">
                        <Typography variant="body2" component={"span"}>
                            {moment(currentDate.date).format(view === 'dayGridMonth' || view === 'timeGridWeek' ? 'MMMM, YYYY' : 'Do MMMM, YYYY')}
                        </Typography>
                    </Button>
                    {/*                    <Button
                        startIcon={<HourglassBottomRoundedIcon/>}
                        variant="contained"
                        color="primary"
                        sx={{textTransform: "capitalize", paddingRight: 2.4}}>
                        <BadgeStyled badgeContent={2}>
                            {t("pending")}
                        </BadgeStyled>
                    </Button>*/}
                </Hidden>

                {/*                <Hidden smUp>
                    <ButtonBadgeStyled
                        variant="contained"
                        color="primary">
                        <Badge badgeContent={2} color="secondary">
                            <HourglassBottomRoundedIcon/>
                        </Badge>
                    </ButtonBadgeStyled>
                </Hidden>*/}
            </Box>

            <Hidden smUp>
                <Stack direction="row" spacing={1.5} justifyContent={"flex-end"} sx={{margin: "0.5rem 0"}}>
                    <CalendarViewButton
                        data={[
                            {icon: <TodayIcon/>, label: "Day"},
                            {icon: <DayIcon/>, label: "Week"},
                            {icon: <WeekIcon/>, label: "Month"},
                            {icon: <GridIcon/>, label: "List"},
                        ]}
                        onSelect={(event: any) => console.log(event)}
                    />


                    <CalendarAddButton
                        onClickEvent={() => dispatch(openDrawer({type: "add", open: true}))}
                    />
                </Stack>
            </Hidden>
            <Hidden smDown>
                {/*{...(viewOption.color !== undefined  && {  })}*/}
                <Stack direction="row" spacing={1.5}>
                    {VIEW_OPTIONS.map((viewOption) => (
                        <Tooltip key={viewOption.value}
                                 TransitionComponent={Zoom}
                                 onClick={() => viewOption.value !== "export" && handleViewChagne(viewOption.value)}
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
                    <Button
                        startIcon={<AddEventIcon/>}
                        variant="contained"
                        onClick={() => dispatch(openDrawer({type: "add", open: true}))}
                        color="warning">
                        {t("add")}
                    </Button>
                </Stack>
            </Hidden>
        </RootStyled>
    );
}

export default CalendarToolbar;
