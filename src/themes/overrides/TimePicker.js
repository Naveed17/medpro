import * as React from "react";
import TextField from "@mui/material/TextField";
import {TimePicker as MuiTimePicker} from "@mui/x-date-pickers";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import moment from "moment-timezone";

export default function TimePicker({...props}) {
    const {onChange, defaultValue} = props;
    const [initial, setInitial] = React.useState(defaultValue[0]);
    const [end, setEnd] = React.useState(defaultValue[1]);

    React.useEffect(() => {
        onChange(initial, end);
    }, [initial, end, onChange]);

    return (
        <Box
            sx={{
                display: "flex",
                //   "& .MuiOutlinedInput-root": { maxWidth: "45%" },
                flexDirection: "row",
            }}>

            <MuiTimePicker
                className={"mui-time-picker"}
                ampm={false}
                openTo="hours"
                views={["hours", "minutes"]}
                slots="HH:mm"
                value={defaultValue[0] ? defaultValue[0] : null}
                onChange={(newValue) => moment(newValue).isValid() && setInitial(newValue)}
            />
            <IconButton sx={{mx: 1}}>
                <ArrowForwardIcon/>
            </IconButton>
            <MuiTimePicker
                className={"mui-time-picker"}
                ampm={false}
                openTo="hours"
                views={["hours", "minutes"]}
                inputFormat="HH:mm"
                mask="__:__"
                value={defaultValue[1] ? defaultValue[1] : null}
                onChange={(newValue) => moment(newValue).isValid() && setEnd(newValue)}
                renderInput={(params) => <TextField {...params} />}
            />
        </Box>
    );
}
