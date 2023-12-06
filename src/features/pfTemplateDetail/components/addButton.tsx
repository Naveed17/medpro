import React from "react";
import StyledMenu from "./overrides/styledMenu";
import {Box, Button, MenuItem} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {
  capitalizeFirst,
} from "@lib/hooks";
function AddButton({...props}) {
    const {onClickEvent, t,list, ...rest} = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleEvent = (prop:string) =>{
        onClickEvent(prop)
        handleClose()
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
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                startIcon={<IconUrl path={"ic-doc-add"} />}
                >
                {t && t("btnAdd")}
            </Button>
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
                                right: 14,
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
                 {
                    list.map((menu:any,idx:number)=> (
                <MenuItem disableRipple key={idx} onClick={() => handleEvent(menu)}>
                    { menu.name === "unfolded" ? capitalizeFirst(t(menu.name)):capitalizeFirst(menu.name)}
                </MenuItem>
                    ))
                 }   
               
                
            </StyledMenu>
        </Box>
    )
}

export default AddButton;
