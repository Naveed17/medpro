import { Fragment } from "react";
import {
  Typography,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  InputLabel,
} from "@mui/material";
import { DatePicker } from "@features/datepicker";
export default function PatientFilter({ ...props }) {
  const { item, t } = props;
  return (
    <Box component="figure" sx={{ m: 0 }}>
      <Typography variant="body2" color="text.secondary">
        {t(`filter.${item.gender?.heading}`)}
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup row aria-label="gender" name="row-radio-buttons-group">
          {item.gender?.genders.map((g: string, i: number) => (
            <FormControlLabel
              sx={{ ml: i === 1 ? "5px" : 0 }}
              key={`gender-${i}`}
              value={g}
              control={<Radio />}
              label={t(`filter.${g}`)}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {item.textField?.labels.map(
        (
          lab: {
            label: string;
            placeholder: string;
          },
          i: number
        ) => (
          <Fragment key={`patient-filter-label-${i}`}>
            {lab.label === "name" || lab.label === "telephone" ? (
              <>
                <InputLabel shrink htmlFor={lab.label} sx={{ mt: 2 }}>
                  {t(`filter.${lab.label}`)}
                </InputLabel>
                <TextField
                  fullWidth
                  placeholder={t(`filter.${lab.placeholder}`)}
                />
              </>
            ) : (
              <>
                <InputLabel shrink htmlFor={lab.label} sx={{ mt: 2 }}>
                  {t(`filter.${lab.label}`)}
                </InputLabel>
                <DatePicker />
              </>
            )}
          </Fragment>
        )
      )}
    </Box>
  );
}
