import {DatePicker} from '@mui/x-date-pickers';
import dayjs, {Dayjs} from 'dayjs';
import CalendarPickerIcon from "@themes/overrides/icons/calendarPickerIcon";

function BasicDatePicker({...props}) {
    const {onChange, inputFormat = null, value = dayjs(new Date(), 'DD/MM/YYYY', true) as Dayjs | null} = props;
    return (
        <DatePicker
            {...props}
            format={inputFormat ?? "dd/MM/yyyy"}
            value={value}
            onChange={(newValue) => {
                onChange(newValue);
            }}
            slots={{
                openPickerIcon: CalendarPickerIcon,
            }}
        />
    );
}

export default BasicDatePicker;
