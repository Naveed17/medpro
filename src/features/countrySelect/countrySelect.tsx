import React, {useCallback} from "react";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import {countries} from "./countries";
import {MenuItem, Typography} from "@mui/material";

function CountrySelect({...props}) {
    const {onSelect, initCountry, small} = props;

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
                    <Image
                        loading="lazy"
                        width={20}
                        height={14}
                        style={{marginLeft: 2}}
                        src={`https://flagcdn.com/${option?.code.toLowerCase()}.svg`}
                        alt={state && state.label}
                    />
                    <Typography sx={{ml: 1}}>{option.label}</Typography>
                </MenuItem>
            )}
            renderInput={(params) => {
                params.InputProps.startAdornment = (
                    <InputAdornment position="start">
                        <Image
                            loading="lazy"
                            width={20}
                            height={14}
                            src={`https://flagcdn.com/${state && state.code.toLowerCase()}.svg`}
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
