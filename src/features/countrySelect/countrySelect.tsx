import React, {useCallback, useEffect} from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import {countries} from "./countries";
import {MenuItem, Typography} from "@mui/material";

function CountrySelect({...props}) {
    const {onSelect, initCountry} = props;

    const [state, setstate] = React.useState(initCountry);

    const onSelectState = useCallback(
        (state: any) => {
            onSelect(state);
        },
        [onSelect]
    );

    return (
        <Autocomplete
            id="country-select-demo"
            sx={{width: "100%"}}
            size="small"
            onChange={(e, v) => {
                setstate(v);
                onSelectState(v);
            }}
            value={state}
            options={countries}
            autoHighlight
            disableClearable
            isOptionEqualToValue={(option, value) => option.label === value.label}
            renderOption={(props, option) => (
                <MenuItem  {...props}>
                    <Box component="img"
                         src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}/>
                    <Typography sx={{ml: 1}}>{option.label}</Typography>
                </MenuItem>
            )}
            renderInput={(params) => {
                params.InputProps.startAdornment = (
                    <InputAdornment position="start">
                        <Image
                            loading="lazy"
                            width="27px"
                            height={18}
                            style={{marginLeft: 3}}
                            src={`https://flagcdn.com/w20/${state && state.code.toLowerCase()}.png`}
                            alt={state && state.label}
                        />
                    </InputAdornment>
                );
                return <TextField {...params} variant="outlined" fullWidth/>;
            }}
        />
    );
}

export default CountrySelect;
