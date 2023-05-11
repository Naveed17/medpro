import * as React from 'react';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import TodayIcon from "@themes/overrides/icons/todayIcon";
import DayIcon from "@themes/overrides/icons/dayIcon";
import WeekIcon from "@themes/overrides/icons/weekIcon";
import GridIcon from "@themes/overrides/icons/gridIcon";
import {Collapse, ListItemButton, SvgIcon, Typography, useTheme} from "@mui/material";
import {ToggleButtonStyled} from "@features/toolbar";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {useAppDispatch} from "@app/redux/hooks";
import {setView} from "@features/calendar";
import {useMedicalEntitySuffix} from "@app/hooks";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useRequestMutation} from "@app/axios";
import {Session} from "next-auth";

const VIEW_OPTIONS = [
    {value: "timeGridDay", label: "Day", text: "Jour", icon: TodayIcon},
    {value: "timeGridWeek", label: "Weeks", text: "Semaine", icon: DayIcon},
    {value: "dayGridMonth", label: "Months", text: "Mois", icon: WeekIcon},
    {value: "listWeek", label: "Agenda", text: "List", icon: GridIcon}
];

function DefaultViewMenu() {
    const theme = useTheme();
    const router = useRouter();
    const {data: session, update} = useSession();
    const urlMedicalEntitySuffix = useMedicalEntitySuffix();
    const dispatch = useAppDispatch();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [openItem, setOpenItem] = React.useState(true);

    const {data: user} = session as Session;
    const general_information = (user as UserDataResponse).general_information;

    const {trigger: triggerViewChange} = useRequestMutation(null, "/agenda/set/default-view");

    const handleDefaultView = (view: string) => {
        dispatch(setView(view));
        const form = new FormData();
        form.append("attribute", "agenda_default_view");
        form.append("value", view);
        triggerViewChange({
            method: "PATCH",
            url: `${urlMedicalEntitySuffix}/users/edit/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
            // update the session, without reloading the page
            update({agenda_default_view: view});
        });
    };

    const handleClick = () => {
        setOpenItem(!openItem);
    };

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        option: any,
        index: number,
    ) => {
        handleDefaultView(option.value);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <ToggleButtonStyled
                id="lock-button"
                aria-haspopup="listbox"
                aria-controls="lock-menu"
                aria-label="when device is locked"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClickListItem}
                value="dayGridMonth"
                sx={{
                    width: 37, height: 37, padding: 0, marginTop: '2px',
                    background: theme.palette.background.paper
                }}>
                <SettingsSuggestOutlinedIcon color={"action"}/>
            </ToggleButtonStyled>
            <Menu
                sx={{
                    "& .MuiList-root": {
                        padding: 0
                    }
                }}
                id="lock-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                }}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            left: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
            >
                <List>
                    <ListItemButton onClick={handleClick}>
                        <ListItemText primary="Affichage par défaut"/>
                        {openItem ? <ExpandLess/> : <ExpandMore/>}
                    </ListItemButton>
                    <Collapse in={openItem} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {VIEW_OPTIONS.map((option, index) => (
                                <MenuItem
                                    sx={{pl: 3}}
                                    key={option.value}
                                    selected={index === VIEW_OPTIONS.findIndex(view => view.value === general_information?.agendaDefaultFormat)}
                                    onClick={(event) => handleMenuItemClick(event, option, index)}
                                >
                                    <SvgIcon component={option.icon} width={20} height={20}/>
                                    <Typography ml={1}>{option.text}</Typography>
                                </MenuItem>
                            ))}
                        </List>

                    </Collapse>
                </List>
            </Menu>
        </div>
    )
        ;
}

export default DefaultViewMenu;
