import React from 'react'
import {ListItem, Checkbox, ListItemIcon, ListItemText, FormGroup, FormControlLabel} from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle';
import { styled } from '@mui/material/styles'
import IconUrl from "@themes/urlIcon";

export default function SidebarCheckbox(props) {
    const { text, key, data, onChange, ...rest } = props
    const [checked, setChecked] = React.useState(false);
    const handleChange = (event) => {
        setChecked(event.target.checked);
        onChange(event.target.checked)
    };
    return (
        <FormGroup>
            <FormControlLabel control={<><Checkbox defaultChecked /> <IconUrl sx={{padding: 4}} path="ic_uncheck" /></>}  label="Label"  />
        </FormGroup>
    )
}
