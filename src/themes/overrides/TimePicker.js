import * as React from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { TimePicker as MuiTimePicker } from "@mui/lab";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function TimePicker({ onChange, defaultValue }) {
  const [initial, setInitial] = React.useState(defaultValue[0]);
  const [end, setend] = React.useState(defaultValue[1]);
  React.useEffect(() => {
    onChange(initial, end);
  }, [initial, end, onChange]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          display: "flex",
          //   "& .MuiOutlinedInput-root": { maxWidth: "45%" },
          flexDirection: "row",
        }}
      >

        <MuiTimePicker
          ampm={false}
          openTo="hours"
          views={["hours", "minutes"]}
          inputFormat="HH:mm"
          mask="__:__"
          value={defaultValue[0]}
          onChange={(newValue) => {
              setInitial(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
        <IconButton sx={{ mx: 1 }}>
          <ArrowForwardIcon />
        </IconButton>
        <MuiTimePicker
          ampm={false}
          openTo="hours"
          views={["hours", "minutes"]}
          inputFormat="HH:mm"
          mask="__:__"
          value={defaultValue[1]}
          onChange={(newValue) => {
            setend(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
    </LocalizationProvider>
  );
}
