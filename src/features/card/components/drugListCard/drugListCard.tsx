import React from "react";
import {IconButton, List, ListItem, ListItemIcon, Stack, Typography} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import DrugListCardStyled from "./overrides/drugListCardStyle";
import Icon from '@themes/urlIcon'

function DrugListCard({...props}) {
    const {data, t, list, remove, edit, disabled} = props;
    return (
        <DrugListCardStyled sx={{mb: list && "8px !important"}}>
            <Stack onClick={(ev) => {
                edit(data)
            }} direction='row' style={{opacity: disabled ? 0.4 : 1}} alignItems="center">
                <Stack>
                    <Typography variant="body2" textTransform="uppercase" fontWeight={"bold"}>{data.name}</Typography>
                    <Typography variant={"body2"} margin={0}>{data.dosage} {data.duration && `${t('duration')} ${data.duration} ${t(data.durationType)}`} {data.note && `(${data.note})`}</Typography>
                </Stack>
                {!list &&
                    <Stack direction='row' spacing={1} alignItems="center" ml="auto">
                        <IconButton disabled={disabled} size="small" onClick={() => {
                            edit(data)
                        }}>
                            <Icon path="ic-duotone"/>
                        </IconButton>
                        <IconButton disabled={disabled} size="small" onClick={(e) => {
                            e.stopPropagation()
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
