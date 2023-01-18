import React, {useCallback} from "react";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import {countries} from "./countries";
import {Avatar, MenuItem, Typography} from "@mui/material";

function CountrySelect({...props}) {
    const {onSelect, initCountry = "", small, ...rest} = props;
    const onSelectState = useCallback(
        (state: any) => {
            onSelect(state);
        },
        [onSelect]
    );

    return (
        <Autocomplete
            {...rest}
            id="country-select-demo"
            sx={{
                ...rest.sx,
                ...(small && {
                    ...rest.sx,
                    "& .MuiAutocomplete-input": {
                        display: "none"
                    },
                    "& .MuiAutocomplete-inputRoot": {
                        paddingLeft: "2px!important",
                        paddingRight: "1.6rem!important"
                    }
                })
            }}
            size="small"
            onChange={(e, v) => {
                onSelectState(v);
            }}
            value={initCountry}
            options={countries}
            autoHighlight
            disableClearable
            isOptionEqualToValue={(option, value) => option.label === value.label}
            renderOption={(props, option) => (
                <MenuItem  {...props}>
                    <Avatar
                        sx={{
                            width: 26,
                            height: 18,
                            borderRadius: 0.4
                        }}
                        alt={initCountry && initCountry.label}
                        src={`https://flagcdn.com/${option?.code.toLowerCase()}.svg`}
                    />
                    <Typography sx={{ml: 1}}>{option.label}</Typography>
                </MenuItem>
            )}
            renderInput={(params) => {
                params.InputProps.startAdornment = initCountry && (
                    <InputAdornment position="start">
                        <Avatar
                            sx={{
                                width: 24,
                                height: 16,
                                borderRadius: 0.4,
                                ml: ".5rem",
                                mr: -.8
                            }}
                            alt={initCountry && initCountry.label}
                            src={`https://flagcdn.com/${initCountry && initCountry.code.toLowerCase()}.svg`}
                        />
                    </InputAdornment>
                );

                return <TextField {...params} sx={{paddingLeft: 0}} variant="outlined" fullWidth/>;
            }}
        />
    );
}

export default CountrySelect;
