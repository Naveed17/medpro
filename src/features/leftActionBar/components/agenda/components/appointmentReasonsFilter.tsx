import {useAppSelector} from "@lib/redux/hooks";
import {Autocomplete, Divider, Stack, TextField} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import React, {useCallback, useEffect, useState} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {leftActionBarSelector} from "@features/leftActionBar";
import {useTranslation} from "next-i18next";
import FormControl from "@mui/material/FormControl";
import {useConsultationReasons} from "@lib/hooks/rest";

function AppointmentReasonsFilter({...props}) {
    const {OnSearch} = props;
    const {reasons, isLoading} = useConsultationReasons();

    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

    const {t} = useTranslation('common');
    const {query: filter} = useAppSelector(leftActionBarSelector);

    const handleOnSearch = useCallback((value: any) => {
        OnSearch(value);
    }, [OnSearch]);

    useEffect(() => {
        if (filter?.reasons) {
            setSelectedReasons(filter?.reasons?.split(','));
        } else {
            setSelectedReasons([]);
        }
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <FormControl component="form" fullWidth onSubmit={e => e.preventDefault()}>
            <Autocomplete
                id={"select-reason"}
                disabled={!reasons}
                multiple
                autoHighlight
                disableClearable
                size="small"
                value={reasons && selectedReasons.length > 0 ? reasons.filter(motif => selectedReasons.includes(motif.uuid)) : []}
                onChange={(e, newValue: any[]) => {
                    e.stopPropagation();
                    const reasonsUuid = newValue.map(reason => reason.uuid);
                    setSelectedReasons(reasonsUuid);
                    handleOnSearch({
                        ...filter,
                        reasons: reasonsUuid.length === 0 ? undefined : reasonsUuid.join(",")
                    });
                }}
                sx={{color: "text.secondary"}}
                options={reasons?.filter(item => item.isEnabled) ?? []}
                loading={reasons?.length === 0}
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
                    <Stack key={option.uuid ? option.uuid : "-1"}>
                        {!option.uuid && <Divider/>}
                        <MenuItem
                            {...props}
                            {...(!option.uuid && {sx: {fontWeight: "bold"}})}
                            value={option.uuid}>
                            {!option.uuid && <AddOutlinedIcon/>}
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
                                           {isLoading ?
                                               <CircularProgress color="inherit"
                                                                 size={20}/> : null}
                                           {params.InputProps.endAdornment}
                                       </React.Fragment>
                                   ),
                               }}
                               placeholder={t("reason-consultation-placeholder")}
                               sx={{paddingLeft: 0}}
                               variant="outlined" fullWidth/>}/>
        </FormControl>)
}

export default AppointmentReasonsFilter;
