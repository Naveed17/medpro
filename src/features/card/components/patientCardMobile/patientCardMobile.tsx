import {useState} from "react";
// material
import {Typography, IconButton, Box, List, ListItem, ListItemIcon, ListItemAvatar} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
// router
import Icon from "@themes/urlIcon";
import {Popover} from "@features/popover";
import SettingTableStyled from "./overrides/SettingTableStyled";
import {Label} from "@features/label";

const menuList = [
    {
        title: "Patient Details",
        icon: <CheckRoundedIcon/>,
        action: "onOpenPatientDrawer",
    },
    {
        title: "Edit Patient",
        icon: <CheckRoundedIcon/>,
        action: "onOpenEditPatient",
    },
    {
        title: "Cancel",
        icon: <CheckRoundedIcon/>,
        action: "onCancel",
    },
];

export default function MobileTable({...props}) {
    const {item, size, contextMenuList = null, button = null, onAction, onDeleteItem = null} = props;
    const theme = useTheme();
    const [openTooltip, setOpenTooltip] = useState(false);

    return (
        <SettingTableStyled  {...(onDeleteItem && {onClick: () => onDeleteItem()})}>
            <List className="patient-config-list" component='div'>
                <ListItem
                    component="div"
                    disablePadding
                    sx={{
                        borderRadius:
                            !size && size !== "small" ? "0px 10px 10px 0px" : "6px",
                    }}>
                    <ListItemAvatar>
                        <Icon path="ic-outline-agenda-tick" width={20} height={20}/>
                    </ListItemAvatar>
                    <ListItemIcon>
                        <Label sx={{bgcolor: item?.type?.color}} className="consultation-label" variant="filled">
                            {item?.type?.name}
                        </Label>
                    </ListItemIcon>
                    <Box sx={{mr: .5, ml: 1}}>
                        {!size && size !== "small" && (
                            <Typography
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    "& svg": {
                                        width: 12,
                                        height: 12,
                                        mr: 1,
                                        "& path": {fill: theme.palette.error.main},
                                    },
                                }}
                                variant="body2"
                                color="primary.main"
                                component="span">
                                <Icon path="ic-video"/>
                            </Typography>
                        )}

                        <Box sx={{display: "flex", alignItems: "center"}}>
                            <Typography
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: "text.primary",
                                    mr: 1,
                                    "& svg": {
                                        width: 14,
                                        height: 14,
                                        mr: 1,
                                        "& path": {fill: theme.palette.text.secondary},
                                    },
                                }}
                                variant="body2"
                                color="primary.main"
                                component="span">
                                <Icon path="ic-agenda-jour"/>
                                {item.date}
                            </Typography>
                            {item.time !== "00:00" && <Typography
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: "text.primary",
                                    "& svg": {
                                        width: 14,
                                        height: 14,
                                        mr: "4px",
                                        "& path": {fill: theme.palette.text.secondary},
                                    },
                                }}
                                variant="body2"
                                color="primary.main"
                                component="span">
                                <Icon path="ic-time"/>
                                {item.time}
                            </Typography>}
                        </Box>
                    </Box>
                    <Box sx={{ml: 'auto'}}>
                        {contextMenuList ? <div>
                            <Popover
                                open={openTooltip}
                                handleClose={() => setOpenTooltip(false)}
                                menuList={contextMenuList ? contextMenuList : menuList}
                                onClickItem={(itempopver: { title: string; icon: string; action: string }) => {
                                    setOpenTooltip(false);
                                    onAction(itempopver.action);
                                }}
                                button={
                                    <IconButton
                                        onClick={() => {
                                            setOpenTooltip(true);
                                        }}
                                        sx={{display: "block", ml: "auto"}}
                                        size="small">
                                        <Icon path="more-vert"/>
                                    </IconButton>
                                }
                            />
                        </div> : <>{button}</>}
                    </Box>
                </ListItem>
            </List>
        </SettingTableStyled>
    );
}
