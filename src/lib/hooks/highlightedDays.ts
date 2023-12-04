import {Theme} from "@mui/material";

export const highlightedDays = (note: number, theme: Theme) => {
    return note === -1 ? theme.palette.grey['400'] :
        note >= 1 && note <= 3 ? theme.palette.success.main :
            note > 3 && note <= 5 ? theme.palette.success.darker :
                note > 5 && note <= 10 ? theme.palette.error.main :
                    note > 10 ? theme.palette.error.dark : undefined;
}
