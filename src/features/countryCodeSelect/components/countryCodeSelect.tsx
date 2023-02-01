import Image from "next/image";
import { useEffect, useState } from "react";
import { Box, InputAdornment, TextField } from "@mui/material";
import { countries } from "../countries";
import AutoCompleteStyled from "./overrides/AutoCompleteStyled";

function CountryCodeSelect({ ...props }) {
  const { selected } = props;
  const [state, setstate] = useState(countries[221]);
  useEffect(() => {
    selected(state);
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AutoCompleteStyled
      id="country-select-demo"
      sx={{ width: { xs: "120px", lg: "130px" } }}
      size="small"
      onChange={(e: any, v: any) => (setstate(v), selected(v))}
      value={state}
      options={countries}
      autoHighlight
      disableClearable
      getOptionLabel={(option: any) => `${option.phone}`}
      isOptionEqualToValue={(option: any, value: any) =>
        option.phone === value.phone
      }
      renderOption={(props: any, option: any) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
          key={option.code}>
          {option.code && (
            <Image
              src={`https://flagcdn.com/${option.code.toLowerCase()}.svg`}
              alt={option.code}
              width={20}
              height={14}
            />
          )}
          {option?.phone}
        </Box>
      )}
      renderInput={(params: any) => {
        params.InputProps.startAdornment = (
          <InputAdornment position="start">
            {state?.code && (
              <Image
                style={{ marginLeft: 3 }}
                alt={"flag"}
                src={`https://flagcdn.com/${state.code.toLowerCase()}.svg`}
                width={27}
                height={15}
              />
            )}
          </InputAdornment>
        );
        return <TextField {...params} variant="outlined" fullWidth />;
      }}
    />
  );
}

export default CountryCodeSelect;
