import {IconButton, List, ListItem, ListItemIcon, Stack, Typography} from '@mui/material'
import React from 'react'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {useTranslation} from "next-i18next";
import moment from 'moment-timezone';
import {AgendaTimelineCard} from '@features/card';
import RootStyled from './overrides/rootStyle';

function AgendaTimeLine() {
    const {t} = useTranslation("common");
    const [startDate, setStartDate] = React.useState(new Date())
    const handleIncreesDays = () => {
        setStartDate(new Date(startDate.setDate(startDate.getDate() + 1)))
    }
    const handleDecreesDays = () => {
        setStartDate(new Date(startDate.setDate(startDate.getDate() - 1)))
    }
    const today = moment(startDate).isSame(moment(), "day");

    return (
        <RootStyled spacing={1}>
            <Stack borderRadius={1.3} bgcolor={theme => theme.palette.background.default} direction='row'
                   alignItems='center' justifyContent='space-between'>
                <IconButton disableRipple size='small' onClick={handleDecreesDays}>
                    <KeyboardArrowLeftIcon fontSize='small' color='primary'/>
                </IconButton>
                <Typography fontWeight={600}
                            color="primary">{today ? t("today") : startDate.toDateString()}</Typography>
                <IconButton disableRipple size='small' onClick={handleIncreesDays}>
                    <KeyboardArrowRightIcon fontSize='small' color='primary'/>
                </IconButton>
            </Stack>
            <List>
                {Array.from({length: 7}).map((_, idx) =>
                    <ListItem key={idx} disablePadding sx={{py: .5, alignItems: 'flex-start'}}>
                        <ListItemIcon>
                            <Typography fontWeight={500} variant='body2' color="text.secondary">
                                08:00
                            </Typography>
                        </ListItemIcon>
                        <AgendaTimelineCard/>
                    </ListItem>
                )}

            </List>
        </RootStyled>
    )
}

export default AgendaTimeLine
