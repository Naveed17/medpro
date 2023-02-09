import TextField from "@mui/material/TextField";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider, TimePicker} from '@mui/x-date-pickers';
import Stack from "@mui/material/Stack";
import {LocaleFnsProvider} from "@app/localization";
import {useAppSelector} from "@app/redux/hooks";
import {configSelector} from "@features/base";
import {useState} from "react";
import {Box, IconButton} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function CustomTimePicker({...props}) {
    const {stepper} = props
    const [initial, setInitial] = useState<Date | null>(new Date());
    const [end, setEnd] = useState<Date | null>(new Date());

    const {locale} = useAppSelector(configSelector);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={LocaleFnsProvider(locale)}>
            {stepper ? <Stack spacing={3}>
                <TimePicker
                    ampm={false}
                    openTo="hours"
                    views={["hours", "minutes"]}
                    inputFormat="HH:mm"
                    mask="__:__"
                    value={initial}
                    onChange={(newValue) => {
                        setInitial(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Stack> :
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row"
                    }}
                >
                    <TimePicker
                        ampm={false}
                        openTo="hours"
                        views={["hours", "minutes"]}
                        inputFormat="HH:mm"
                        mask="__:__"
                        value={initial}
                        onChange={(newValue) => {
                            setInitial(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <IconButton sx={{ mx: 1 }}>
                        <ArrowForwardIcon />
                    </IconButton>
                    <TimePicker
                        ampm={false}
                        openTo="hours"
                        views={["hours", "minutes"]}
                        inputFormat="HH:mm"
                        mask="__:__"
                        value={end}
                        onChange={(newValue) => {
                            setEnd(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Box>
            }
        </LocalizationProvider>
    );
}

export default CustomTimePicker;
