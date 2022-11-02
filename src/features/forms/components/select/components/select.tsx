import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectCustom({ ...props }) {
  const { placeholder, list, getData, value } = props;
  const [data, setData] = React.useState(value);
  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;

    setData(
      // On autofill we get a the stringified value.
      value
    );
    getData(value);
  };
  return (
    <>
      <FormControl size="small" fullWidth>
        <Select
          labelId="demo-simple-select-label"
          id={"demo-simple-select"}
          value={data}
          onChange={handleChange}
          displayEmpty={true}
          sx={{ color: "text.secondary" }}
          renderValue={(value) =>
            value?.length
              ? Array.isArray(value)
                ? value.join(",")
                : value
              : placeholder
              ? placeholder
              : "Select"
          }>
          {list.map((name: any, i: number) => (
            <MenuItem key={`name-${i}`} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
