import { Typography, Box, InputLabel, Checkbox, Grid } from "@mui/material";
import Icon from "@themes/urlIcon";
import { DatePicker } from "@features/datepicker";
import { CustomTimePicker } from "@features/customTimePicker";

function AppointmentFilter({ ...props }) {
  const { item, t } = props;
  return (
    <Box component="figure" sx={{ m: 0 }}>
      <Typography variant="body2" color="text.secondary">
        {t(`${item.type?.heading}`)}
      </Typography>
      <Box sx={{ display: "flex" }}>
        {item.type?.types.map(
          (
            type: {
              icon: string;
              text: string;
            },
            i: number
          ) => (
            <Box
              key={`appo-type${i}`}
              component="label"
              htmlFor={`${type.text}-${i}`}
              color="text.secondary"
              className="appo-type"
              sx={{
                ml: i === 1 ? 1 : 0,
              }}
            >
              <Checkbox id={`${type.text}-${i}`} />
              <Icon path={type.icon} className={`${type.text}-icon-${i}`} />

              {t(`${type.text}`)}
            </Box>
          )
        )}
      </Box>
      <Box>
        <InputLabel shrink sx={{ mt: 2 }}>
          {t(`next-appointment`)}
        </InputLabel>
        <DatePicker />
      </Box>
      <Box>
        <InputLabel shrink sx={{ mt: 2 }}>
          {t(`last-appointment`)}
        </InputLabel>
        <DatePicker />
      </Box>
    </Box>
  );
}
export default AppointmentFilter;
