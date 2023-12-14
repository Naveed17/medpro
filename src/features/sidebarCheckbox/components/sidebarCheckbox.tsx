import React, {useEffect} from 'react'
import {Checkbox, ListItemIcon, ListItemText, Stack} from '@mui/material'
import SidebarCheckboxStyled from './overrides/sidebarCheckboxStyled';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export default function SidebarCheckbox({...props}) {
    const {data, label = "text", onChange, t = null, prefix = null, checkState = false} = props
    const [checked, setChecked] = React.useState(checkState);

    const handleChange = (event: any) => {
        setChecked(event.target.checked);
        onChange(event.target.checked)
    }

    useEffect(() => {
        setChecked(checkState);
    }, [checkState]);

    return (
        <SidebarCheckboxStyled
            styleprops={data?.color ? data.color : 'primary'}
            component='label' htmlFor={data.uuid}>
            <Checkbox
                size="small"
                checked={checked}
                onChange={handleChange}
                id={data.uuid}
                name={data.uuid}
            />
            <Stack direction={"row"} alignItems={"center"}>
                {(data.color || typeof data.icon === "string") &&
                    <ListItemIcon
                        sx={{
                            "& svg": {
                                border: .1,
                                borderColor: 'divider',
                                borderRadius: '50%',
                                p: 0.05,
                                m: "0 .5rem"
                            },
                            "& .MuiAvatar-root": {
                                margin: 1.3
                            }
                        }}>
                        {(data.color && typeof data.icon === "string") ? <FiberManualRecordIcon
                                sx={{
                                    color: data.color
                                }}
                            />
                            :
                            data.icon
                        }
                    </ListItemIcon>
                }
                <ListItemText primary={t ? t(`${prefix + '.' ?? ""}${data[label]}`) : data[label]}/>
            </Stack>
        </SidebarCheckboxStyled>
    )
}
