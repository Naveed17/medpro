import React from 'react'
import {IconButton, ListItem, ListItemIcon, ListItemText} from '@mui/material'
import IconUrl from "@themes/urlIcon";
import { styled } from '@mui/material/styles'
import Icon from "@themes/icon";

const RootStyle = styled(ListItem)(({ theme }) => ({
    padding: theme.spacing(0),
    borderRadius: theme.spacing(0.75),

}))

function QualifactionsProfessional({ children, ...props }) {
    const {item, provided, snapshot, ...rest} = props
    return (
        <RootStyle
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            secondaryAction={
                <IconButton aria-label="delete">
                    <IconUrl path="ic-autre" />
                </IconButton>
            }>
            <IconUrl path="ic-drag"/>
            <ListItemText sx={{margin: 2}} primary={item.name}/>
        </RootStyle>
    )
}
export default QualifactionsProfessional
