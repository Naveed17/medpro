import React from 'react'
import {Checkbox, FormGroup, FormControlLabel} from '@mui/material'
import IconUrl from "@themes/urlIcon";

export default function SidebarCheckbox(props) {
    const {text, key, data, onChange, ...rest} = props
    const [checked, setChecked] = React.useState(false);
    const handleChange = (event) => {
        setChecked(event.target.checked);
        onChange(event.target.checked)
    };
    return (
        <FormGroup>
            <FormControlLabel control={<><Checkbox defaultChecked/> <IconUrl sx={{padding: 4}} path="ic_uncheck"/></>}
                              label="Label"/>
        </FormGroup>
    )
}
