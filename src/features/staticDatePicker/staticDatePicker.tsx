// material
import TextField from "@mui/material/TextField";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider, StaticDatePicker as DatePicker} from '@mui/x-date-pickers';
// styles
import { RootStyled } from "./overrides";

// redux
import { useAppSelector } from "@lib/redux/hooks";

// __________
import { configSelector } from "@features/base";
import { LocaleFnsProvider } from "@lib/localization";

export default function StaticDatePicker({ ...props }) {
  const { loading, value, onChange, onDateDisabled, ...rest } = props;
  const { locale } = useAppSelector(configSelector);

  return (
    <RootStyled className={loading ? "loading" : ""}>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        locale={LocaleFnsProvider(locale)}
      >
        <DatePicker
          reduceAnimations
          displayStaticWrapperAs="desktop"
          shouldDisableDate={onDateDisabled}
          onChange={onChange}
          value={value}
          {...rest}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </RootStyled>
  );
}
