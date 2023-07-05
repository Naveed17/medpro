import {Checkbox, IconButton, Stack, Switch, Typography,} from "@mui/material";
import RootStyled from "./overrides/rootStyled";
import IconUrl from "@themes/urlIcon";
import React from "react";

function SettingAgendaMobileCard({...props}) {
    const {data, t, handleChange} = props;
    return (
        <RootStyled>
            <Stack spacing={1.8}>
                <Stack direction="row" alignItems="center">
                    <Stack width="60%" direction="row" alignItems="center">
                        <Typography fontWeight={600}>{t("table.name")}:</Typography>
                        <Typography ml={1}>{data.name}</Typography>
                    </Stack>
                    <Stack width="40%" direction="row" alignItems="center">
                        <Typography fontWeight={600}>{t("table.type")}:</Typography>
                        <Typography ml={1}>{data.type}</Typography>
                    </Stack>
                </Stack>
                <Stack direction="row" alignItems="center">
                    <Stack width="60%" direction="row" alignItems="center">
                        <Typography fontWeight={600}>{t("table.autoConfirm")}:</Typography>
                        <Switch name="isAutoConfirm" checked={data.isAutoConfirm}/>
                    </Stack>
                    <Stack width="40%" direction="row" alignItems="center">
                        <Typography fontWeight={600}>{t("table.default")}:</Typography>
                        <Checkbox name="isDefault" checked={data.isDefault}/>
                    </Stack>
                </Stack>
                <Stack direction="row" alignItems="center">
                    <Stack width="60%" direction="row" alignItems="center">
                        <Typography fontWeight={600}>{t("table.actif")}:</Typography>
                        <Switch name="isActive" checked={data.isActive}/>
                    </Stack>
                    <Stack width="40%" direction="row" alignItems="center">
                        <Typography fontWeight={600}>{t("table.public")}:</Typography>
                        <Switch name="isPublic" checked={data.isPublic}/>
                    </Stack>
                </Stack>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={3}>
                    <IconButton
                        size="small"
                        onClick={() => {
                            handleChange(data, "edit");
                        }}>
                        <IconUrl path="setting/edit"/>
                    </IconButton>

                    <IconButton
                        size="small"
                        onClick={() => {
                            handleChange(data, "remove");
                        }}>
                        <IconUrl path="setting/icdelete"/>
                    </IconButton>
                </Stack>
            </Stack>
        </RootStyled>
    );
}

export default SettingAgendaMobileCard;
