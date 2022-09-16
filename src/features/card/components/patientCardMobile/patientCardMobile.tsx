import {useState} from "react";

// material
import {Typography, IconButton, Box, List, ListItem} from "@mui/material";
import {styled, useTheme} from "@mui/material/styles";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

// router
import Icon from "@themes/urlIcon";
import {Popover} from "@features/popover";

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

// import { Popover } from "src/components";
const SettingTable = styled(`div`)(({theme}) => ({
    marginBottom: 8,
    " & .patient-config-list": {
        paddingTop: 0,
        paddingBottom: 0,
        "& .MuiListItem-root": {
            backgroundColor: theme.palette.background.paper,
            borderWidth: "1px 1px 1px 4px",
            borderColor: "#dddddd",
            borderStyle: "solid",
            padding: "8px",
            paddingLeft: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            "&.pending": {
                borderLeftColor: theme.palette.warning.main,
            },
            "&.warning": {
                borderLeftColor: theme.palette.warning.main,
            },
            "&.completed": {
                borderLeftColor: theme.palette.success.main,
            },
            "&.error": {
                borderLeftColor: theme.palette.error.main,
            },
        },
        "& .settings-icon": {
            transform: "rotate(90deg)",
            fontSize: 20,
        },
        "& .check-icon": {
            fontSize: 20,
        },
        "& .more-icon-btn": {
            width: 22,
            height: 22,
        },
        '& .MuiIconButton-root[variant="custom"]': {
            width: 33,
            height: 32,
            marginLeft: 4,
        },
    },
}));

interface cardProps {
    status: string;
    date: string;
    time: string;
    name: string;
}

export default function MobileTable({...props}) {
    const {item, size, contextMenuList = null, button = null, onAction} = props;
    const theme = useTheme();
    const [openTooltip, setOpenTooltip] = useState(false);

    return (
        <SettingTable>
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
        </SettingTable>
    );
}
