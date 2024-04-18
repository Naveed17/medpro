import React from "react";
import StyledMenu from "./overrides/styledMenu";
import {Box, MenuItem} from "@mui/material";
import FastForwardOutlinedIcon from '@mui/icons-material/FastForwardOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {CustomIconButton} from "@features/buttons";
import AgendaAddViewIcon from "@themes/overrides/icons/agendaAddViewIcon";

function CalendarAddButton({...props}) {
    const {onClickEvent, t} = props;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAddFullAppointment = () => {
        handleClose();
        onClickEvent("add-complete");
    }

    const handleAddQuickAppointment = () => {
        handleClose();
        onClickEvent("add-quick");
    }

    return (
        <Box
            sx={{
                "& .MuiButton-startIcon>*:nth-of-type(1)": {
                    fontSize: 19
                }
            }}>
            <CustomIconButton
                onClick={handleClick}
                variant="filled"
                sx={{p: .6}}
                color={"primary"}
                size={"small"}>
                <AgendaAddViewIcon/>
            </CustomIconButton>
            <StyledMenu
                {...{open, anchorEl}}
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: (theme) => `drop-shadow(${theme.customShadows.popover})`,
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
                                right: 20,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }
                }}
                onClose={handleClose}>
                <MenuItem onClick={handleAddQuickAppointment} disableRipple>
                    <FastForwardOutlinedIcon/>
                    {t("add-quick")}
                </MenuItem>
                <MenuItem onClick={handleAddFullAppointment} disableRipple>
                    <AddOutlinedIcon/>
                    {t("add-complete")}
                </MenuItem>
            </StyledMenu>
        </Box>
    )
}

export default CalendarAddButton;
