// material
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker as DatePicker } from "@mui/x-date-pickers/StaticDatePicker";

// styles
import { RootStyled } from "./overrides";

// redux
import { useAppSelector } from "@app/redux/hooks";

// __________
import { configSelector } from "@features/base";
import { LocaleFnsProvider } from "@app/localization/localization";

export default function StaticDatePicker({ ...props }) {
  const { loading, value, onChange, ...rest } = props;
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
          disablePast
          onChange={onChange}
          value={value}
          {...rest}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </RootStyled>
  );
}
