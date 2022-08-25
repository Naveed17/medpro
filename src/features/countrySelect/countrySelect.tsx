import * as React from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import { countries } from "./countries";

export default function CountrySelect({ ...props }) {
  const [state, setstate] = React.useState({
    code: "TN",
    label: "Tunisia",
    phone: "216",
  });
  React.useEffect(() => {
    props.selected(state);
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Autocomplete
      id="country-select-demo"
      sx={{ width: "100%" }}
      size="small"
      onChange={(e, v) => {
        setstate(v);
        props.selected(v);
      }}
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
          <Image
            // loading="lazy"
            width="20px"
            layout="fill"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            // srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt={option.code}
          />
          {option.label}
        </Box>
      )}
      renderInput={(params) => {
        params.InputProps.startAdornment = (
          <InputAdornment position="start">
            <Image
              // loading="lazy"
              width="27px"
              layout="fill"
              style={{ marginLeft: 3 }}
              src={`https://flagcdn.com/w20/${
                state && state.code.toLowerCase()
              }.png`}
              // srcSet={`https://flagcdn.com/w40/${
              //   state && state.code.toLowerCase()
              // }.png 2x`}
              alt=""
            />
          </InputAdornment>
        );
        return <TextField {...params} variant="outlined" fullWidth />;
      }}
    />
  );
}
