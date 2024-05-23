import {DatePicker} from '@mui/x-date-pickers';
import dayjs, {Dayjs} from 'dayjs';
import CalendarPickerIcon from "@themes/overrides/icons/calendarPickerIcon";
import {useCallback} from "react";

function BasicDatePicker({...props}) {
    const {onChange, inputFormat = null, value = dayjs(new Date(), 'DD/MM/YYYY', true) as Dayjs | null} = props;

    const handleChange = useCallback((val: any) => {
        onChange(val);
    }, [onChange])

    return (
        <DatePicker
            {...props}
            format={inputFormat ?? "dd/MM/yyyy"}
            value={value}
            onChange={handleChange}
            slots={{
                openPickerIcon: CalendarPickerIcon,
            }}
        />
    );
}

export default BasicDatePicker;
