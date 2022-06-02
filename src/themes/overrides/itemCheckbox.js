import React from 'react'
import {ListItem, Checkbox, ListItemText, ListItemIcon, Box, FormGroup, FormControlLabel} from '@mui/material'
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
                marginTop: 7,
            }
        },
    }
})
function ItemCheckbox({...props}) {

    console.log(props);
    const [checked, setChecked] = React.useState(false);
    const handleChange = (event) => {
        setChecked(event.target.checked);
        props.onChange(event.target.checked);
    };
    return (
        <RootStyled key={props.id} component='label' htmlFor={props.data.name}>
            <Checkbox
                size="small"
                checked={checked}
                onChange={handleChange}
                id={props.data.name}
                name={props.data.name}
            />
            {(props.data.icon || props.data.img) &&
                <ListItemIcon>
                    <IconUrl path={props.data?.icon} />
                    {props.data?.img && <Box component="img" src={props.data?.img} alt={props.data?.name} />}
                </ListItemIcon>
            }
            <ListItemText sx={{marginLeft:1}} primary={props.data.name} />
        </RootStyled >
    )
}
export default ItemCheckbox;