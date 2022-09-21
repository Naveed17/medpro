import Image from "next/image";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import React, {useCallback, useState} from "react";
import {MenuItem, Typography} from "@mui/material";

export default function CountrySelect({...props}) {
    const {onSelect, countries} = props;
    const [state, setstate] = useState({
        code: "TN",
        name: "Tunisia",
        phone: "216",
        uuid: "eede-dededed"
    });

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
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            renderOption={(props, option) => (
                <MenuItem  {...props}>
                    <Box key={option.uuid}
                         component="img"
                         src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}/>
                    <Typography sx={{ml: 1}}>{option.name}</Typography>
                </MenuItem>
            )}
            renderInput={(params) => {
                params.InputProps.startAdornment = (
                    <InputAdornment position="start">
                        <Image
                            width="27px"
                            height={18}
                            style={{marginLeft: 3}}
                            src={`https://flagcdn.com/w20/${
                                state && state.code.toLowerCase()
                            }.png`}
                            alt=""
                        />
                    </InputAdornment>
                );
                return <TextField {...params} variant="outlined" fullWidth/>;
            }}
        />
    );
}
