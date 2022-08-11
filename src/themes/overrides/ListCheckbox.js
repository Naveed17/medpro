import React from 'react'
import {ListItem, Checkbox, ListItemIcon, ListItemText, Box} from '@mui/material'
import {styled} from '@mui/material/styles';
import IconUrl from "@themes/urlIcon";

const RootStyled = styled(ListItem)(({theme,}) => {
    return {
        cursor: 'pointer',
        width: 'max-content',
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
                width: '23px',
                marginRight: '5px',
            }
        }

    }
})
export default function ListCheckbox(props) {
    const {text, data, onChange, ...rest} = props
    const [checked, setChecked] = React.useState(false);
    const handleChange = (event) => {
        setChecked(event.target.checked);
        onChange(event.target.checked)
    };
    return (
        <RootStyled component='label' htmlFor={data.name}>
            <Checkbox
                size="small"
                checked={props.checked}
                onChange={handleChange}
                id={data.name}
                name={data.name}/>
            {(data.icon || data.img) &&
                <ListItemIcon>
                    {data.icon && <IconUrl path={data.icon}/>}
                    {data?.img && <Box component="img" src={data?.img} alt={data?.text}/>}
                </ListItemIcon>
            }
            <ListItemText primary={data.name}/>
        </RootStyled>
    )
}
