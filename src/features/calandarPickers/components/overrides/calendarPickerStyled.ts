import { styled } from '@mui/material/styles';
import {CalendarPicker, StaticDatePicker} from "@mui/x-date-pickers";

const CalendarPickerStyled = styled(StaticDatePicker)(({ theme }) => ({
    maxHeight: "-webkit-fill-available",
    "& .MuiTypography-caption": {
        color: theme.palette.primary.main,
    }
}));

export default CalendarPickerStyled;

