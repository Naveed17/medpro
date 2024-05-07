import React, {useCallback, useState} from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import {countries} from "./countries";
import {Avatar, MenuItem, Typography} from "@mui/material";

function CountrySelect({...props}) {
    const {onSelect, showCountryFlagOnly = false, initCountry = "", small, ...rest} = props;

    const [countriesData] = useState<any[]>(countries.sort(
        country => initCountry.code?.toLowerCase() === country?.code?.toLowerCase() ? -1 : 1));

    const onSelectState = useCallback(
        (state: any) => {
            onSelect(state);
        },
        [onSelect]
    );
    return (
        <Autocomplete
            {...rest}
            id="country-select"
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
                }),
                ...(showCountryFlagOnly && {
                    "& .MuiInputBase-root.MuiOutlinedInput-root": {
                        paddingLeft: 0,
                        background: "transparent"
                    },
                    "& .MuiInputBase-input": {
                        display: "none",
                    }
                })
            }}
            size="small"
            onChange={(e, v) => {
                onSelectState(v);
            }}
            value={countries.find(country => country?.code?.toLocaleLowerCase() === initCountry?.code?.toLocaleLowerCase())}
            options={countriesData}
            autoHighlight
            disableClearable
            getOptionLabel={(option: any) => option.name}
            isOptionEqualToValue={(option: any, value: any) => option.name === value?.name}
            renderOption={(props, option: any) => (
                <MenuItem  {...props}>
                    {option?.code && <Avatar
                        sx={{
                            width: 26,
                            height: 18,
                            borderRadius: 0.4
                        }}
                        alt={initCountry && initCountry.name}
                        src={`https://flagcdn.com/${option?.code.toLowerCase()}.svg`}
                    />}
                    <Typography sx={{ml: 1}}>{option.name}</Typography>
                </MenuItem>
            )}
            renderInput={(params) => {
                params.InputProps.startAdornment = initCountry && (
                    <InputAdornment position="start">
                        {initCountry?.code && <Avatar
                            sx={{
                                width: 24,
                                height: 16,
                                borderRadius: 0.4,
                                ml: 0,
                                mr: -.8
                            }}
                            alt={initCountry.name}
                            src={`https://flagcdn.com/${initCountry.code.toLowerCase()}.svg`}
                        />}
                    </InputAdornment>
                );
                return <TextField {...params} sx={{paddingLeft: 0}} variant="outlined"
                                  fullWidth/>;
            }}
        />
    );
}

export default CountrySelect;
