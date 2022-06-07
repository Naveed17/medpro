import React from 'react'
import {IconButton, ListItem, ListItemText} from '@mui/material'
import IconUrl from "@themes/urlIcon";
import { styled } from '@mui/material/styles'

const RootStyle = styled(ListItem)(({ theme }) => ({
    padding: theme.spacing(0),
    borderRadius: theme.spacing(0.75),

}))

function QualifactionsProfessional({ children, ...props }) {
    const {item, provided, snapshot, ...rest} = props
    return (
        <RootStyle>
            <IconUrl path="ic-drag"/>
            <ListItemText sx={{margin: 2}} primary={item.name}/>
        <IconButton aria-label="delete">
            <IconUrl path="ic-autre" />
        </IconButton>
        </RootStyle>
    )
}
export default QualifactionsProfessional
