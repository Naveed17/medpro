import React from "react";
import {Box, MenuItem, Button, Typography} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FastForwardOutlinedIcon from '@mui/icons-material/FastForwardOutlined';
import AddIcon from "@mui/icons-material/Add";
import {StyledMenu} from "@features/buttons";

function ModelSwitchButton({...props}) {
    const {onClickEvent, t, editModel, lastPrescriptions, drugs, ...rest} = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSetLastPrescription = () => {
        handleClose();
        onClickEvent("last-prescription");
    }

    const handleSetPrescriptionModel = () => {
        handleClose();
        onClickEvent("set-prescription");
    }

    return (
        <Box
            sx={{
                "& .MuiButton-startIcon>*:nth-of-type(1)": {
                    fontSize: 19
                }
            }}>
            <Button
                {...rest}
                id="switch-button"
                aria-controls={open ? 'switch-button' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon/>}
            >
                <Typography>{t('model_prescription')}</Typography>
            </Button>
            <StyledMenu
                id="switch-button"
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
                                left: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {lastPrescriptions.length > 0 && <MenuItem onClick={handleSetLastPrescription} disableRipple>
                    <FastForwardOutlinedIcon/>
                    {t("last_prescription")}
                </MenuItem>}
                <MenuItem disabled={drugs?.length === 0} onClick={handleSetPrescriptionModel} disableRipple>
                    <AddIcon/>
                    {t("createAsModel", {ns: "consultation"})}
                </MenuItem>
            </StyledMenu>
        </Box>
    )
}

export default ModelSwitchButton;
