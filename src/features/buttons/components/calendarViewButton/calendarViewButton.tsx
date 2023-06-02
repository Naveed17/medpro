import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Fade from '@mui/material/Fade';
import RootStyled from './overrides/rootStyled';
import CodeIcon from "@mui/icons-material/Code";
import {MouseEvent, useEffect, useRef, useState} from "react";
import {SvgIcon, useTheme} from "@mui/material";

function CalendarViewButton({...props}) {
    const {views, onSelect = null, view, t, ...rest} = props;
    const theme = useTheme();
    const ref = useRef<HTMLButtonElement>(null);

    const [width, setWidth] = useState(0);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selected, setSelected] = useState(views.find((mode: any) => mode.value === view));

    function handleClick(event: MouseEvent<HTMLButtonElement>) {
        if (anchorEl !== event.currentTarget) {
            setAnchorEl(event.currentTarget);
        }
    }

    const handleClose = (props: any) => {
        setAnchorEl(null);
        setSelected(props);
        if (onSelect) {
            onSelect(props?.value);
        }
    }

    useEffect(() => {
        if (ref.current) {
            const element = ref.current.getBoundingClientRect();
            setWidth(element.width);
        }
    }, [])

    return (
        <RootStyled {...rest}>
            <Button
                ref={ref}
                startIcon={
                    <SvgIcon component={selected.icon} width={20} height={20}
                             htmlColor={theme.palette.text.primary}/>
                }
                endIcon={
                    <CodeIcon
                        sx={{
                            transform: "rotate(90deg)",
                        }}
                    />
                }
                variant="outlined"
                aria-owns={anchorEl ? "simple-menu" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                onMouseOver={handleClick}>
                {t(`agenda-view.${selected.value}`)}
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => handleClose(selected)}
                MenuListProps={{onMouseLeave: () => handleClose(selected)}}
                TransitionComponent={Fade}
                sx={{
                    '& .MuiList-root': {
                        width: width,
                        py: 0,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            py: 1.44,
                            '& .MuiTypography-root': {
                                fontSize: 12,
                                color: theme.palette.text.secondary
                            },
                            '& .MuiListItemIcon-root': {
                                minWidth: '20px',
                            },
                            '&:not(:last-of-type)': {
                                borderBottom: `1px solid ${theme.palette.divider}`
                            }
                        },
                        '& svg': {
                            fontSize: 16,
                        }
                    }
                }}
            >
                {views.map((item: any) => (
                    <MenuItem onClick={() => handleClose(item)} key={item.value}>
                        {item.icon && <ListItemIcon>
                            <SvgIcon component={item.icon} width={20} height={20}
                                     htmlColor={theme.palette.text.primary}/>
                        </ListItemIcon>}
                        <ListItemText sx={{fontSize: 12}}>{t(`agenda-view.${item.value}`)} </ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </RootStyled>
    );
}

export default CalendarViewButton;
