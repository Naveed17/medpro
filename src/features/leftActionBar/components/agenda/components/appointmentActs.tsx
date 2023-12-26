import {useAppSelector} from "@lib/redux/hooks";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import {Autocomplete, Divider, Stack, TextField} from "@mui/material";
import {leftActionBarSelector} from "@features/leftActionBar";
import MenuItem from "@mui/material/MenuItem";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FormControl from "@mui/material/FormControl";
import {useConsultationActs} from "@lib/hooks/rest";

function AppointmentActs({...props}) {
    const {OnSearch} = props;
    const {acts: consultationActs} = useConsultationActs();

    const [selectedActs, setSelectedActs] = useState<string[]>([]);

    const {t} = useTranslation('common');
    const {query: filter} = useAppSelector(leftActionBarSelector);

    const handleOnSearch = useCallback((value: any) => {
        OnSearch(value);
    }, [OnSearch]);

    const acts = consultationActs.reduce((actsUpdate: any[], data: any) => [...(actsUpdate ?? []), {
        ...data?.act,
        medicalProfessionalAct: data.uuid
    }], []) as any[];

    useEffect(() => {
        if (filter?.acts) {
            setSelectedActs(filter?.acts?.split(','));
        } else {
            setSelectedActs([]);
        }
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <FormControl component="form" fullWidth onSubmit={e => e.preventDefault()}>
            <Autocomplete
                id={"select-act"}
                disabled={!acts}
                multiple
                autoHighlight
                disableClearable
                size="small"
                value={acts && selectedActs.length > 0 ? acts.filter(act => selectedActs.includes(act?.medicalProfessionalAct ?? "")) : []}
                onChange={(e, newValue: any[]) => {
                    e.stopPropagation();
                    const actsUuid = newValue.map(act => act.medicalProfessionalAct);
                    setSelectedActs(actsUuid);
                    handleOnSearch({...filter, acts: actsUuid.length === 0 ? undefined : actsUuid.join(",")});
                }}
                sx={{color: "text.secondary"}}
                options={acts ?? []}
                loading={acts?.length === 0}
                getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === 'string') {
                        return option;
                    }
                    // Add "xxx" option created dynamically
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    // Regular option
                    return option.name;
                }}
                isOptionEqualToValue={(option: any, value) => option.name === value?.name}
                renderOption={(props, option) => (
                    <Stack key={option.medicalProfessionalAct ? option.medicalProfessionalAct : "-1"}>
                        {!option.uuid && <Divider/>}
                        <MenuItem
                            {...props}
                            {...(!option.medicalProfessionalAct && {sx: {fontWeight: "bold"}})}
                            value={option.medicalProfessionalAct}>
                            {!option.medicalProfessionalAct && <AddOutlinedIcon/>}
                            {option.name}
                        </MenuItem>
                    </Stack>
                )}
                renderInput={params =>
                    <TextField color={"info"}
                               {...params}
                               InputProps={{
                                   ...params.InputProps,
                                   endAdornment: (
                                       <React.Fragment>
                                       </React.Fragment>
                                   ),
                               }}
                               placeholder={t("acts-consultation-placeholder")}
                               sx={{
                                   paddingLeft: 0,
                                   whiteSpace: "nowrap",
                                   overflow: "hidden",
                                   textOverflow: "ellipsis"
                               }}
                               variant="outlined" fullWidth/>}/>
        </FormControl>)
}

export default AppointmentActs;
