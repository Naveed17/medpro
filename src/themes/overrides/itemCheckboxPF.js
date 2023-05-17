import React from 'react'
import {ListItem, Checkbox, ListItemText, ListItemIcon, Box} from '@mui/material'
import { styled } from '@mui/material/styles';
import IconUrl from "@themes/urlIcon";
const RootStyled = styled(ListItem)(({ theme, }) => {
    return {
        cursor: 'pointer',
        padding: theme.spacing(0.5, 1),
        '& .MuiCheckbox-root': {
            padding: '0px',
            width: '30px',
            height: '30px',
        },
        '& .MuiListItemIcon-root': {
            minWidth: '15px',
            '& .react-svg svg': {
                width: '10px',
                height: '10px',
                '& path': {
                    fill: theme.palette.text.primary,
                }
            },
            '& img': {
                height: '23px',
                marginLeft:4,
                //marginTop: 7,
            }
        },
    }
})
function ItemCheckboxPF({...props}) {

    const [checked, setChecked] = React.useState(props.checked);
    const label = props.data.label ? 'label' : 'name';
    const handleChange = (event) => {
        setChecked(event.target.checked);
        props.onChange(event.target.checked);
    };

    return (
        <RootStyled key={props.id} component='label' htmlFor={props.data[label]}>
            <Checkbox
                size="small"
                checked={props.checked}
                onChange={handleChange}
                id={props.data[label]}
                name={props.data[label]}
            />
            {
                (props.data.icon || props.data.logoUrl) &&
                <ListItemIcon>
                    {props.data?.icon && <IconUrl path={props.data?.icon}/>}
                    {props.data?.logoUrl && <Box component="img" src={props.data?.logoUrl.url} alt={props.data[label]}/>}
                </ListItemIcon>
            }
            <ListItemText sx={{marginLeft:1}} primary={ props.data[label] } />
        </RootStyled >
    )
}
export default ItemCheckboxPF;