import {DatePicker} from '@mui/x-date-pickers';
import dayjs, {Dayjs} from 'dayjs';

function BasicDatePicker({...props}) {
    const {onChange, value = dayjs(new Date(), 'DD/MM/YYYY', true) as Dayjs | null} = props;
    return (
        <DatePicker
            {...props}
            format={"dd/MM/yyyy"}
            value={value}
            onChange={(newValue) => {
                onChange(newValue);
            }}

        />
    );
}

export default BasicDatePicker;
