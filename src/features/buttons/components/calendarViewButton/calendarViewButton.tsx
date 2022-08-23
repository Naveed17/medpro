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

function CalendarViewButton({...props}) {
    const {data, onSelect, ...rest} = props;
    const [width, setWidth] = useState(0);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selected, setSelected] = useState(data[0]);
    const ref = useRef<HTMLButtonElement>(null);

    function handleClick(event: MouseEvent<HTMLButtonElement>) {
        if (anchorEl !== event.currentTarget) {
            setAnchorEl(event.currentTarget);
        }
    }

    const handleClose = (props: any) => {
        setAnchorEl(null);
        setSelected(props);
        onSelect(props?.label);
    }

    useEffect(() => {
        if (ref.current) {
            const element = ref.current.getBoundingClientRect();
            setWidth(element.width);
        }
        onSelect(selected?.label);

    }, [onSelect, selected.label])
    return (
        <RootStyled>
            <Button
                ref={ref}
                startIcon={selected.icon}
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
                {selected.label}
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
                        boxShadow: '0px 5px 12px rgba(0, 0, 0, 0.06)',
                        '& .MuiMenuItem-root': {
                            px: 1,
                            py: 1.44,
                            '& .MuiTypography-root': {
                                fontSize: 12,
                                color: '#7C878E'
                            },
                            '& .MuiListItemIcon-root': {
                                minWidth: '20px',
                            },
                            '&:not(:last-of-type)': {
                                borderBottom: '1px solid #E3EAEF',
                            }
                        },
                        '& svg': {
                            fontSize: 13,
                        }
                    }
                }}
            >
                {data.map((item: { label: string, icon: string }) => (
                    <MenuItem onClick={() => handleClose(item)} key={item.label}>
                        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                        <ListItemText sx={{fontSize: 12}}>{item.label}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </RootStyled>
    );
}

export default CalendarViewButton;
