import React from 'react'
import {Checkbox, ListItemIcon, ListItemText} from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle';
import SidebarCheckboxStyled from './overrides/sidebarCheckboxStyled';
import Icon from '@themes/urlIcon';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

interface Props {
    data: any;
    label?: string;
    onChange: (v: any) => void;
    translate: {
        t: Function;
        ready: boolean;
    }

}

export default function SidebarCheckbox(props: Props) {
    const {data, label = "text", onChange, translate} = props
    const {t, ready} = translate;
    const [checked, setChecked] = React.useState(false);

    const handleChange = (event: any) => {
        setChecked(event.target.checked);
        onChange(event.target.checked)
    };
    if (!ready) return (<>loading translations...</>);

    return (
        <SidebarCheckboxStyled styleprops={data?.color ? data.color : 'primary'}
                               component='label' htmlFor={data.uuid}>
            <Checkbox
                size="small"
                checked={checked}
                onChange={handleChange}
                id={data.uuid}
                name={data.uuid}
            />
            {(data.color || data.icon) &&
                <ListItemIcon
                    sx={{
                        "& svg": {
                            border: .1,
                            borderColor: 'divider',
                            borderRadius: '50%',
                            p: 0.05,
                            m: "0 .5rem"
                        },
                    }}>
                    {data.color && <FiberManualRecordIcon
                        sx={{
                            color: data.color
                        }}
                    />}
                    {/*{data.icon && <Icon {...(data.icon === 'ic-video') && {className: 'ic-video'}} path={data.icon}/>}*/}
                </ListItemIcon>
            }
            <ListItemText primary={label === "text" ? t(data[label]) : data[label]}/>
        </SidebarCheckboxStyled>
    )
}
