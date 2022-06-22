import {useEffect, useState} from "react";
import { Box, InputAdornment, TextField } from "@mui/material";
import {countries} from "../countries";
import AutoCompleteStyled from "./overrides/AutoCompleteStyled"
// @ts-ignore
function CountryCodeSelect({selected}) {
    const [state, setstate] = useState(countries[221]);
    useEffect(() => {
        selected(state)
    }, [state]);
    return (
        <AutoCompleteStyled
            id="country-select-demo"
            sx={{width: {xs: '110px', lg: "130px"}}}
            size="small"
            onChange={(e: any, v: any) => (setstate(v), selected(v))}
            value={state}
            options={countries}
            autoHighlight
            disableClearable
            getOptionLabel={(option:any) => `${option.phone}`}
            isOptionEqualToValue={(option: any, value: any) => option.phone === value.phone}
            renderOption={(props:any, option:any) => (
                <Box
                    component="li"
                    sx={{"& > img": {mr: 2, flexShrink: 0}}}
                    {...props}
                    key={option.code}
                >
                    <img
                        loading="lazy"
                        width="20"
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                        alt=""
                    />
                    {option?.phone}
                </Box>
            )}
            renderInput={(params: any) => {
                params.InputProps.startAdornment = (
                    <InputAdornment position="start">
                        <img
                            loading="lazy"
                            width="27"
                            style={{ marginLeft: 3}}
                            src={`https://flagcdn.com/w20/${state && state.code.toLowerCase()
                            }.png`}
                            srcSet={`https://flagcdn.com/w40/${state && state.code.toLowerCase()
                            }.png 2x`}
                            alt=""
                        />
                    </InputAdornment>
                );
                return <TextField  {...params} variant="outlined" fullWidth />;
            }}/>
    );
}

export default CountryCodeSelect