import React from "react";
import { Stack, Typography, List, ListItem, ListItemIcon, IconButton} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import DrugListCardStyled from "./overrides/drugListCardStyle";
import Icon from '@themes/urlIcon'

function DrugListCard({...props}) {
    const {data, t, list, remove, edit} = props;
    return (
        <DrugListCardStyled sx={{mb: list && "8px !important"}}>
            <Stack direction='row' alignItems="center">
                <Stack spacing={1}>
                    <Typography variant="body2" textTransform="uppercase">{data.name}</Typography>
                    <List
                        {...(list ? {
                            sx: {
                                display: 'flex',
                                '& .MuiListItem-root': {width: 'auto', '&:not(:first-child)': {ml: 1.8}},
                            }
                        } : {})}
                    >
                        <ListItem>
                            <ListItemIcon>
                                <CircleIcon/>
                            </ListItemIcon>
                            {data.dosage}</ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CircleIcon/>
                            </ListItemIcon>
                            {t('duration')} {data.duration} {t(data.durationType)}</ListItem>
                    </List>
                </Stack>
                {!list &&
                    <Stack direction='row' spacing={1} alignItems="center" ml="auto">
                        <IconButton size="small" onClick={() => {
                            edit(data)
                        }}>
                            <Icon path="ic-duotone"/>
                        </IconButton>
                        <IconButton size="small" onClick={() => {
                            remove(data)
                        }}>
                            <Icon path="setting/icdelete"/>
                        </IconButton>
                    </Stack>
                }
            </Stack>
        </DrugListCardStyled>
    );
}

export default DrugListCard;
