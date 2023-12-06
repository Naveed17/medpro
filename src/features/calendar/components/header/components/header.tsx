import {Box, Stack, Typography, MenuItem, IconButton} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import moment from "moment-timezone";
import {ActionMenu} from "@features/menu";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {capitalizeFirst} from "@lib/hooks";
import {BadgeStyled, openDrawer} from "@features/calendar";
import {batch} from "react-redux";
import {setAbsenceData} from "@features/drawer";


function Header({...props}) {
    const {
        isGridWeek,
        event,
        datEvents = 0,
        currentDate,
        absences,
        OnAddAbsence,
        OnDeleteAbsence,
        dispatch,
        isMobile,
        contextMenuHeader,
        setContextMenuHeader,
        hiddenDays,
        setHiddenDays,
        t
    } = props;
    const date = moment(event.date.toLocaleDateString("fr"), "DD/MM/YYYY");
    const hasBlockedDay = absences.filter((absence: any) => moment(absence.start).isSame(event.date) && moment(absence.end).format('HH:mm') === '23:59')?.length > 0;
    const hasBlockedCurrentDay = absences.filter((absence: any) => moment(absence.start).isSame(currentDate.date) && moment(absence.end).format('HH:mm') === '23:59')?.length > 0;

    const handleCloseMenu = () => {
        setContextMenuHeader(null);
    }

    const OnMenuActions = (action: string) => {
        handleCloseMenu();
        switch (action) {
            case "onDisplayWorkDays":
                setHiddenDays([...hiddenDays, moment(currentDate.date).isoWeekday()])
                break;
            case "onAddBlockedDay":
                OnAddAbsence();
                break;
            case "onDeleteBlockedDay":
                OnDeleteAbsence();
                break;
            case "onAddLeave":
                batch(() => {
                    dispatch(setAbsenceData({
                        startDate: moment(currentDate.date).toDate(),
                        endDate: moment(currentDate.date).endOf("day").toDate()
                    }));
                    dispatch(openDrawer({type: "absence", open: true}));
                });
                break;
        }
    }

    return (
        <div className="header-day-main">
            <Box
                className="header-day-main-box"
                sx={{
                    display: event.view.type === "timeGridDay" ? isMobile ? "grid!important" as any : "flex" : "inline-flex",
                    justifyContent: event.view.type === "timeGridDay" ? "flex-start" : "space-between",
                    px: event.view.type === "listWeek" ? 0 : 1,
                    width: "100%"
                }}>
                {!isMobile ?
                    <Stack direction='row' justifyContent='space-between' width={1}>
                        {(isGridWeek) ? (
                            <BadgeStyled
                                badgeContent={!hasBlockedDay ? datEvents : <IconUrl path={"ic-banned"}/>}
                                {...{'data-events': !hasBlockedDay ? datEvents : -1}}
                                {...(date.format("DD/MM/YYYY") !== moment().format("DD/MM/YYYY") && {
                                    sx: {
                                        '& .MuiTypography-root': {
                                            color: (theme) => theme.palette.text.secondary
                                        }
                                    }
                                })}>
                                <Stack direction={'row'} alignItems={'center'} spacing={1.2}>
                                    <Typography variant="subtitle1" color="text.primary" fontSize={16}
                                                fontWeight={500}>
                                        {capitalizeFirst(date.format("ddd")).replace('.', '')}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.primary" fontSize={16}
                                                fontWeight={500}>
                                        {date.format("DD")}
                                    </Typography>
                                </Stack>
                            </BadgeStyled>

                        ) : (
                            <Typography variant="subtitle1" color="text.primary" fontSize={14}>
                                <div>
                                    {date.format("dddd").charAt(0).toUpperCase()}{date.format("dddd").slice(1)}
                                </div>
                            </Typography>
                        )}

                        <Stack spacing={1} alignItems='flex-end'
                               onClick={(e) => {
                                   e.stopPropagation();
                                   setContextMenuHeader(
                                       contextMenuHeader === null
                                           ? {
                                               mouseX: e.clientX + 2,
                                               mouseY: e.clientY - 6,
                                           } : null
                                   )
                               }}>
                            <IconButton size="small" sx={{width: 24, height: 24}}>
                                <MoreVertIcon/>
                            </IconButton>
                        </Stack>
                    </Stack>
                    :
                    <>
                        <Typography variant="subtitle1" color="text.primary" fontSize={14}>
                            <div>
                                {event.view.type === "timeGridDay" ?
                                    date.format("dddd") :
                                    date.format("dd").toUpperCase()[0]
                                }
                            </div>

                        </Typography>
                        {(isGridWeek) &&
                            <Typography variant="subtitle1" color="text.primary" fontSize={18} mr={2}>
                                {date.format("DD")}
                            </Typography>}
                    </>
                }
            </Box>
            <ActionMenu {...{contextMenu: contextMenuHeader, handleClose: handleCloseMenu}}>
                {[
                    {
                        heading: 'calendar_view',
                        list: [
                            {
                                icon: 'ic-agenda-new',
                                title: "display_workdays",
                                action: "onDisplayWorkDays"
                            }
                        ]

                    },
                    {
                        heading: "program",
                        list: [
                            {
                                icon: 'ic-banned',
                                title: hasBlockedCurrentDay ? "delete_blocked_day" : "add_blocked_day",
                                action: hasBlockedCurrentDay ? "onDeleteBlockedDay" : "onAddBlockedDay"
                            },
                            {
                                icon: 'ic-leave',
                                title: "add_leave",
                                action: "onAddLeave"
                            }
                        ]
                    }
                ].map((item, index) => (
                    <Box key={index} m={1}>
                        <Stack>
                            <Typography variant="subtitle1" color="common.white" fontWeight={600} fontSize={14}
                                        mb={2} ml={1}>
                                {t(item.heading)}
                            </Typography>
                            {item.list.map((v, i) => (
                                <MenuItem key={i} onClick={() => OnMenuActions(v.action)}>
                                    <IconUrl path={v.icon}/>
                                    <Typography ml={.5} color="common.white">
                                        {t(v.title)}
                                    </Typography>
                                </MenuItem>
                            ))}

                        </Stack>
                    </Box>
                ))}
            </ActionMenu>
        </div>
    )
}

export default Header;
