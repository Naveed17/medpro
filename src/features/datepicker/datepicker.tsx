import {useAppSelector} from "@lib/redux/hooks";
import {configSelector} from "@features/base";
import TextField from "@mui/material/TextField";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {LocaleFnsProvider} from "@lib/localization";

function BasicDatePicker({...props}) {
    const {onChange, value} = props;
    const {locale} = useAppSelector(configSelector);

    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={LocaleFnsProvider(locale)}
        >
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
