import React from "react";
import {IconButton, Stack, Typography} from "@mui/material";
import DrugListCardStyled from "./overrides/drugListCardStyle";
import Icon from '@themes/urlIcon';

function DrugListCard({...props}) {
    const {data, t, list, remove, edit, disabled} = props;
    return (
        <DrugListCardStyled sx={{mb: list && "8px !important"}}>
            <Stack onClick={(ev) => {
                edit(data)
            }} direction='row' style={{opacity: disabled ? 0.4 : 1}} alignItems="center">
                <Stack>
                    <Typography variant="body2" textTransform="uppercase" fontWeight={"bold"}>{data.name}</Typography>
                    <Typography variant={"body2"}
                                margin={0}>{data.cycles[0].dosage} {data.cycles[0].duration && data.cycles[0].duration > 0 && `${t('duration')} ${data.cycles[0].duration} ${t(data.cycles[0].durationType)}`} {data.cycles[0].note && `(${data.cycles[0].note})`}</Typography>
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
