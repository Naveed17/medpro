import {Autocomplete, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography, useTheme} from '@mui/material'
import {useTranslation} from 'next-i18next'
import React, {useState} from 'react';
import IconUrl from "@themes/urlIcon";

import {LoadingScreen} from "@features/loadingScreen";
import useMPActs from "@lib/hooks/rest/useMPacts";

function AddActDialog({...props}) {
    const {data} = props;
    const {newAct, setNewAct, apcis, mainActes} = data

    const [apci, setApci] = useState<string[]>([]);

    const theme = useTheme();
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
        setNewAct({...newAct, apci: (value as string[]).join(",")})
        setApci(typeof value === 'string' ? value.split(',') : value);
    };

    const {t, ready} = useTranslation("settings", {keyPrefix: 'insurance.config'});

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <Stack spacing={1}>
            <Stack direction={"row"} spacing={1}>
                <Stack spacing={1} style={{width: "100%"}}>
                    <Typography color={theme.palette.text.secondary} fontSize={12}>{t('act')}</Typography>
                    <Autocomplete
                        options={acts}
                        getOptionLabel={(option) => option.act.name}
                        isOptionEqualToValue={(option: any, value: any) => option.act.name === value.act.name}

                        popupIcon={<IconUrl path={"mdi_arrow_drop_down"}/>}
                        size={"small"}
                        onChange={(event, newValue) => {
                            if (newValue) {
                                let exist = mainActes.find((act: any) => act.act.uuid === newValue.uuid)
                                if (exist)
                                    setNewAct(exist)
                                else {
                                    setNewAct({
                                        md_act:newValue.uuid,
                                        act: newValue.act,
                                        fees: newValue.fees,
                                        apci: [],
                                        patient_part: 0,
                                        refund: newValue.fees
                                    })
                                }
                            } else setNewAct(null)

                        }}
                        renderInput={(params) => (
                            <TextField {...params} placeholder={t('dialog.name')} variant="outlined"/>
                        )}
                    />
                </Stack>
                <Stack spacing={1} style={{width: "100%"}}>
                    <Typography color={theme.palette.text.secondary} fontSize={12}>{t('table.fees')}</Typography>
                    <TextField
                        value={newAct?.fees || ""}

                        disabled={!newAct}
                        onChange={(event) => {
                            newAct.fees = event.target.value
                            setNewAct({...newAct})
                        }}
                        placeholder={t("table.fees")}
                    />
                </Stack>
            </Stack>
            <Stack direction={"row"} spacing={1}>
                <Stack spacing={1} style={{width: "100%"}}>
                    <Typography color={theme.palette.text.secondary} fontSize={12}>{t('dialog.stepper.refund_amount')}</Typography>

                    <TextField
                        value={newAct?.refund || ""}
                        disabled={!newAct}

                        onChange={(event) => {
                            newAct.refund = event.target.value
                            setNewAct({...newAct})
                        }}
                        placeholder={t("dialog.stepper.refund_amount")}
                    />
                </Stack>
                <Stack spacing={1} style={{width: "100%"}}>
                    <Typography color={theme.palette.text.secondary} fontSize={12}>{t('table.patient_share')}</Typography>

                    <TextField
                        value={newAct?.patient_part || ""}
                        disabled={!newAct}

                        onChange={(event) => {
                            newAct.patient_part = event.target.value
                            setNewAct({...newAct})
                        }}
                        placeholder={t("table.patient_share")}
                    />
                </Stack>
            </Stack>
            {apcis.length > 0 && <Stack direction={"row"} spacing={1}>
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
                            background: theme.palette.grey["A500"]
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
            </Stack>}
        </Stack>
    )
}

export default AddActDialog
