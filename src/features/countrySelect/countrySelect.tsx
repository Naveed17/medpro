import React, {useCallback} from "react";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import {countries} from "./countries";
import {MenuItem, Typography} from "@mui/material";

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
                    <Image
                        loading="lazy"
                        width={24}
                        height={14}
                        style={{marginLeft: 2}}
                        src={`https://flagcdn.com/${option?.code.toLowerCase()}.svg`}
                        alt={initCountry && initCountry.label}
                    />
                    <Typography sx={{ml: 1}}>{option.label}</Typography>
                </MenuItem>
            )}
            renderInput={(params) => {
                params.InputProps.startAdornment = initCountry && (
                    <InputAdornment position="start">
                        <Image
                            loading="lazy"
                            width={24}
                            height={16}
                            src={`https://flagcdn.com/${initCountry && initCountry.code.toLowerCase()}.svg`}
                            alt={initCountry && initCountry.label}
                        />
                    </InputAdornment>
                );

                return <TextField {...params} variant="outlined" fullWidth/>;
            }}
        />
    );
}

export default CountrySelect;
