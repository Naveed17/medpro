import {useAppSelector} from "@app/redux/hooks";
import {configSelector} from "@features/base";
import TextField from "@mui/material/TextField";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {LocaleFnsProvider} from "@app/localization";
import dayjs,{ Dayjs } from 'dayjs';
function BasicDatePicker({...props}) {
    const {onChange, value = dayjs(new Date(), 'DD/MM/YYYY', true) as Dayjs | null} = props;
    const {locale} = useAppSelector(configSelector);

    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            locale={LocaleFnsProvider(locale)}>
            <DatePicker
                {...props}
                inputFormat={"dd/MM/yyyy"}
                mask="__/__/____"
                value={value}
                onChange={(newValue) => {
                    onChange(newValue);
                }}
                renderInput={(params) => <TextField {...params} fullWidth/>}
                
            />
        </LocalizationProvider>
    );
}

export default BasicDatePicker;
