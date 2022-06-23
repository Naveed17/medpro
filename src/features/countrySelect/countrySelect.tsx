import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import { countries } from "./countries";

export default function CountrySelect({ selected }) {
  const [state, setstate] = React.useState({
    code: "TN",
    label: "Tunisia",
    phone: "216",
  });
  React.useEffect(() => {
    selected(state);
  }, [state]);
  return (
    <Autocomplete
      id="country-select-demo"
      sx={{ width: "100%" }}
      size="small"
      onChange={(e, v) => (setstate(v), selected(v))}
      value={state}
      options={countries}
      autoHighlight
      disableClearable
      isOptionEqualToValue={(option, value) => option.label === value.label}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          />
          {option.label}
        </Box>
      )}
      renderInput={(params) => {
        params.InputProps.startAdornment = (
          <InputAdornment position="start">
            <img
              loading="lazy"
              width="27"
              style={{ marginLeft: 3 }}
              src={`https://flagcdn.com/w20/${
                state && state.code.toLowerCase()
              }.png`}
              srcSet={`https://flagcdn.com/w40/${
                state && state.code.toLowerCase()
              }.png 2x`}
              alt=""
            />
          </InputAdornment>
        );
        return <TextField {...params} variant="outlined" fullWidth />;
      }}
    />
  );
}
