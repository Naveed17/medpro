import {Autocomplete, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography, useTheme} from '@mui/material'
import {useTranslation} from 'next-i18next'
import React, {useState} from 'react';
import {useRouter} from "next/router";
import IconUrl from "@themes/urlIcon";

import {LoadingScreen} from "@features/loadingScreen";
import useMPActs from "@lib/hooks/rest/useMPacts";

function AddActDialog({...props}) {
    const {data} = props;
    const {newAct, setNewAct,apcis} = data

    const [apci, setApci] = useState<string[]>([]);

    const theme = useTheme();
    const router = useRouter();
    const {acts} = useMPActs({noPagination: true})

    const getCode = (uuids: string[]) => {
        let codes: string[] = [];
        uuids.map(uuid => codes.push(apcis.find((apci: { uuid: string }) => apci.uuid === uuid).code))
        return codes;
    }

    const handleSelect = (event: SelectChangeEvent<typeof apci>) => {
        const {
            target: {value},
        } = event;
        setNewAct({...newAct,apci:(value as string[]).join(",")})
        setApci(typeof value === 'string' ? value.split(',') : value);
    };

    const {t, ready} = useTranslation("settings", {keyPrefix: 'insurance.config'});

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <Stack spacing={1}>
            <Stack direction={"row"} spacing={1}>
                <Autocomplete
                    options={acts}
                    getOptionLabel={(option) => option.act.name}
                    isOptionEqualToValue={(option: any, value: any) => option.act.name === value.act.name}
                    style={{width: "100%"}}
                    popupIcon={<IconUrl path={"mdi_arrow_drop_down"}/>}
                    size={"small"}
                    onChange={(event, newValue) => {
                        setNewAct(newValue)
                    }}
                    renderInput={(params) => (
                        <TextField {...params} placeholder={t('dialog.name')} variant="outlined"/>
                    )}
                />
                <TextField
                    value={newAct?.fees || ""}
                    style={{width: "100%"}}
                    onChange={(event) => {

                    }}
                    placeholder={t("table.fees")}
                />
            </Stack>
            <Stack direction={"row"} spacing={1}>
                <TextField
                    value={""}
                    style={{width: "100%"}}
                    onChange={(event) => {

                    }}
                    placeholder={t("dialog.stepper.refund_amount")}
                /><TextField
                value={""}
                style={{width: "100%"}}
                onChange={(event) => {

                }}
                placeholder={t("table.patient_share")}
            />
            </Stack>
            <Stack direction={"row"} spacing={1}>
                <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    displayEmpty={true}
                    sx={{
                        width: "49.5%",
                        ".MuiSelect-multiple": {
                            py: 1,
                            px: 1,
                            textAlign: 'left',
                            background:theme.palette.grey["A500"]
                        }
                    }}
                    value={apci}
                    onChange={handleSelect}
                    renderValue={(selected) => {
                        if (selected?.length === 0) {
                            return (
                                <Typography
                                    fontSize={13}
                                    color="textSecondary">
                                    {t("table.apci")}
                                </Typography>
                            );
                        }
                        return selected ? getCode(selected).join(", ") : "";
                    }}>
                    {apcis?.map((apci: { uuid: string, code: string }) => (
                        <MenuItem
                            key={apci.uuid}
                            value={apci.uuid}
                        >
                            {apci.code}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>
        </Stack>
    )
}

export default AddActDialog
