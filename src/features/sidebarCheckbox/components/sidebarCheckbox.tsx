import React from 'react'
import { Checkbox, ListItemIcon, ListItemText } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle';
import RootStyled from './overrides/sidebarCheckboxStyled';
import Icon from '@themes/urlIcon'
interface Props {
    data: any;
    onChange: (v: any) => void;

}
export default function SidebarCheckbox(props: Props) {
    const { data, onChange, ...rest } = props
    const [checked, setChecked] = React.useState(false);
    const handleChange = (event: any) => {
        setChecked(event.target.checked);
        onChange(event.target.checked)
    };
    return (
        <RootStyled styleprops={data?.color ? data.color : 'primary'}
            component='label' htmlFor={data.name}>
            <Checkbox
                size="small"
                checked={checked}
                onChange={handleChange}
                id={data.name}
                name={data.name}
            />
            {(data.color || data.icon) &&
                <ListItemIcon>
                    {data.color && <CircleIcon />}
                    {data.icon && <Icon {...(data.icon === 'ic-video') && { className: 'ic-video' }} path={data.icon} />}
                </ListItemIcon>
            }
            <ListItemText primary={data.text} />
        </RootStyled>
    )
}
