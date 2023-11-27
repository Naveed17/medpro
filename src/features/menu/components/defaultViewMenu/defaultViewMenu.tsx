import * as React from 'react';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import TodayIcon from "@themes/overrides/icons/todayIcon";
import DayIcon from "@themes/overrides/icons/dayIcon";
import WeekIcon from "@themes/overrides/icons/weekIcon";
import GridIcon from "@themes/overrides/icons/gridIcon";
import {
    Collapse,
    Divider,
    FormControlLabel,
    ListItemButton, Stack,
    SvgIcon, Switch, Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import {ToggleButtonStyled} from "@features/toolbar";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {agendaSelector, setView} from "@features/calendar";
import {useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useRequestQueryMutation} from "@lib/axios";
import {Session} from "next-auth";
import {useTranslation} from "next-i18next";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import {useCallback, useEffect, useState} from "react";
import {dashLayoutSelector} from "@features/base";
import Zoom from "@mui/material/Zoom";

const VIEW_OPTIONS = [
    {value: "timeGridDay", label: "day", text: "Jour", icon: TodayIcon},
    {value: "timeGridWeek", label: "weeks", text: "Semaine", icon: DayIcon},
    {value: "dayGridMonth", label: "months", text: "Mois", icon: WeekIcon},
    {value: "listWeek", label: "agenda", text: "List", icon: GridIcon}
];

function DefaultViewMenu({...props}) {
    const {view, onViewChange} = props;
    const theme = useTheme();
    const router = useRouter();
    const {data: session, update} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const dispatch = useAppDispatch();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {t} = useTranslation('common');
    const {config: agenda} = useAppSelector(agendaSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [openItem, setOpenItem] = useState(false);
    const [autoConfirm, setAutoConfirm] = useState(false);

    const {data: user} = session as Session;
    const general_information = (user as UserDataResponse).general_information;
    const roles = (user as UserDataResponse).general_information.roles as Array<string>;

    const {trigger: triggerViewChange} = useRequestQueryMutation("/agenda/set/default-view");
    const {trigger: triggerAutoConfirmEdit} = useRequestQueryMutation("/agenda/set/autoConfirm");

    const handleDefaultView = (view: string) => {
        dispatch(setView(view));
        const form = new FormData();
        form.append("attribute", "agenda_default_view");
        form.append("value", view);
        triggerViewChange({
            method: "PATCH",
            url: `${urlMedicalEntitySuffix}/users/edit/${router.locale}`,
            data: form
        }, {
            onSuccess: () => update({agenda_default_view: view})
        });
    }

    const handleClick = () => {
        setOpenItem(!openItem);
    }

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        option: any) => {
        handleDefaultView(option.value);
        setAnchorEl(null);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleViewChange = useCallback((view: string) => {
        handleClose();
        onViewChange(view);
    }, [onViewChange])

    useEffect(() => {
        agenda && setAutoConfirm(agenda?.isAutoConfirm);
    }, [agenda])

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
                    width: 37, height: 37, padding: 0,
                    background: theme.palette.background.paper
                }}>
                <SettingsRoundedIcon color={"action"}/>
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
                slotProps={{
                    paper: {
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
                                right: 68,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        }
                    }
                }}>
                <List>
                    <ListItemButton>
                        <Stack direction={"row"} spacing={3} alignItems={"center"}>
                            <Typography mr={3}>{t("agenda-mode", {ns: "agenda"})} : </Typography>
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
                        </Stack>
                    </ListItemButton>


                    <ListItemButton onClick={handleClick}>
                        <ListItemText sx={{ml: 1, "& .MuiTypography-root": {fontSize: 13}}}
                                      primary={t("default-view")}/>
                        {openItem ? <ExpandLess/> : <ExpandMore/>}
                    </ListItemButton>
                    <Collapse in={openItem} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {VIEW_OPTIONS.map((option, index) => (
                                <MenuItem
                                    sx={{pl: 3}}
                                    key={option.value}
                                    selected={index === VIEW_OPTIONS.findIndex(view => view.value === general_information?.agendaDefaultFormat)}
                                    onClick={(event) => handleMenuItemClick(event, option)}>
                                    <SvgIcon component={option.icon} fontSize={"small"}/>
                                    <Typography ml={1} variant={"body2"}>{t(`times.${option.label}`)}</Typography>
                                </MenuItem>
                            ))}
                        </List>
                    </Collapse>
                    {!roles?.includes('ROLE_SECRETARY') && <>
                        <Divider/>
                        <ListItemButton>
                            <FormControlLabel
                                sx={{"& .MuiTypography-root": {fontSize: 13}}}
                                control={<Switch
                                    checked={autoConfirm}
                                    onChange={e => {
                                        setAutoConfirm(e.target.checked)
                                        const form = new FormData();
                                        form.append("attribute", "isAutoConfirm");
                                        form.append("value", e.target.checked.toString());
                                        medicalEntityHasUser && triggerAutoConfirmEdit({
                                            method: "PATCH",
                                            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/agendas/${agenda?.uuid}/config/${router.locale}`,
                                            data: form
                                        }, {
                                            onSuccess: () => invalidateQueries([`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/agendas/${router.locale}`]),
                                        });
                                    }}/>}
                                label={t("auto-confirm")}/>
                        </ListItemButton>
                        <Divider/>
                        <ListItemButton onClick={() => router.push('/dashboard/agenda/trash')}>
                            <DeleteOutlineIcon fontSize={"small"}/>
                            <ListItemText
                                sx={{ml: 1, "& .MuiTypography-root": {fontSize: 13}}}
                                primary={t("trash")}/>
                        </ListItemButton>
                    </>}
                </List>
            </Menu>
        </div>
    )
        ;
}

export default DefaultViewMenu;
