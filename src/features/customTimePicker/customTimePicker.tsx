import {Box, IconButton} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {TimePicker as MuiTimePicker} from "@mui/x-date-pickers/TimePicker";
import moment from "moment-timezone";
import {useEffect, useState} from "react";

function CustomTimePicker({...props}) {
    const {onChange, defaultValue} = props;
    const [initial, setInitial] = useState(defaultValue[0]);
    const [end, setEnd] = useState(defaultValue[1]);

    useEffect(() => {
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
                    format="HH:mm"
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
                    format="HH:mm"
                    value={defaultValue[1] ? defaultValue[1] : null}
                    onChange={(newValue) => moment(newValue).isValid() && setEnd(newValue)}
                />
            </Box>)
}

export default CustomTimePicker;
