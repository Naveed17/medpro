import {useState} from "react";
// material
import {Typography, IconButton, Box, List, ListItem} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
// router
import Icon from "@themes/urlIcon";
import {Popover} from "@features/popover";
import SettingTableStyled from "./overrides/SettingTableStyled";

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
    const {item, size, contextMenuList = null, button = null, onAction} = props;
    const theme = useTheme();
    const [openTooltip, setOpenTooltip] = useState(false);

    return (
        <SettingTableStyled>
            <List className="patient-config-list">
                <ListItem
                    disablePadding
                    className={item.status}
                    sx={{
                        borderRadius:
                            !size && size !== "small" ? "0px 10px 10px 0px" : "6px",
                    }}
                >
                    <Box sx={{mr: "4px"}}>
                        <Typography variant="body1" color="text.primary">
                            {item.name}
                        </Typography>
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
                                component="span"
                            >
                                <Icon path="ic-video"/>
                                Pattren
                            </Typography>
                        )}

                        <Box sx={{display: "flex", alignItems: "center"}}>
                            <Typography
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: "text.secondary",
                                    mr: 1,
                                    "& svg": {
                                        width: 12,
                                        height: 12,
                                        mr: 1,
                                        "& path": {fill: theme.palette.text.secondary},
                                    },
                                }}
                                variant="body2"
                                color="primary.main"
                                component="span"
                            >
                                <Icon path="ic-agenda"/>
                                {item.date}
                            </Typography>
                            <Typography
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: "text.secondary",
                                    "& svg": {
                                        width: 12,
                                        height: 12,
                                        mr: "4px",
                                        "& path": {fill: theme.palette.text.secondary},
                                    },
                                }}
                                variant="body2"
                                color="primary.main"
                                component="span"
                            >
                                <Icon path="ic-time"/>
                                {item.time}
                            </Typography>
                        </Box>
                    </Box>
                    <Box>
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
                                        size="small"
                                    >
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
