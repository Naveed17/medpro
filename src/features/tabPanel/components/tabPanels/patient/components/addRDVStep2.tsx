import React from "react";
import { useTranslation } from "next-i18next";

import {
  Box,
  Typography,
  TextField,
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  InputAdornment,
  Button,
  SvgIcon,
} from "@mui/material";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
function SortIcon({ ...props }) {
  return (
    <SvgIcon
      {...props}
      width="13"
      height="26"
      viewBox="0 0 13 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.91662 9.65768C9.81056 9.77435 9.7045 9.83268 9.54541 9.83268C9.38632 9.83268 9.28026 9.77435 9.1742 9.65768L6.3636 6.56602L3.553 9.65768C3.34088 9.89102 3.0227 9.89102 2.81058 9.65768C2.59846 9.42435 2.59846 9.07435 2.81058 8.84102L5.99239 5.34102C6.20451 5.10768 6.52269 5.10768 6.73481 5.34102L9.91662 8.84102C10.1287 9.07435 10.1287 9.42435 9.91662 9.65768Z"
        fill="black"
      />
      <mask
        id="mask0"
        maskUnits="userSpaceOnUse"
        x="2"
        y="5"
        width="9"
        height="5"
      >
        <path
          d="M9.91662 9.65768C9.81056 9.77435 9.7045 9.83268 9.54541 9.83268C9.38632 9.83268 9.28026 9.77435 9.1742 9.65768L6.3636 6.56602L3.553 9.65768C3.34088 9.89102 3.0227 9.89102 2.81058 9.65768C2.59846 9.42435 2.59846 9.07435 2.81058 8.84102L5.99239 5.34102C6.20451 5.10768 6.52269 5.10768 6.73481 5.34102L9.91662 8.84102C10.1287 9.07435 10.1287 9.42435 9.91662 9.65768Z"
          fill="white"
        />
      </mask>

      <path
        d="M9.91662 17.1577L6.73481 20.6577C6.62875 20.7743 6.52269 20.8327 6.3636 20.8327C6.20451 20.8327 6.09845 20.7743 5.99239 20.6577L2.81058 17.1577C2.59846 16.9243 2.59846 16.5743 2.81058 16.341C3.0227 16.1077 3.34088 16.1077 3.553 16.341L6.3636 19.4327L9.1742 16.341C9.38632 16.1077 9.7045 16.1077 9.91662 16.341C10.1287 16.5743 10.1287 16.9243 9.91662 17.1577Z"
        fill="black"
      />
      <mask
        id="mask1"
        maskUnits="userSpaceOnUse"
        x="2"
        y="16"
        width="9"
        height="5"
      >
        <path
          d="M9.91662 17.1577L6.73481 20.6577C6.62875 20.7743 6.52269 20.8327 6.3636 20.8327C6.20451 20.8327 6.09845 20.7743 5.99239 20.6577L2.81058 17.1577C2.59846 16.9243 2.59846 16.5743 2.81058 16.341C3.0227 16.1077 3.34088 16.1077 3.553 16.341L6.3636 19.4327L9.1742 16.341C9.38632 16.1077 9.7045 16.1077 9.91662 16.341C10.1287 16.5743 10.1287 16.9243 9.91662 17.1577Z"
          fill="white"
        />
      </mask>
    </SvgIcon>
  );
}

function AddRDVStep2({ ...props }) {
  const { onClickCancel, onNext } = props;
  const [age, setAge] = React.useState("");
  const [value, setValue] = React.useState<Date | null>(
    new Date("2018-01-01T00:00:00.000Z")
  );

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  const { t, ready } = useTranslation("patient", {
    keyPrefix: "add-appointment",
  });
  if (!ready) return <>loading translations...</>;

  return (
    <div>
      <Box className="inner-section">
        <Typography variant="h6" color="text.primary">
          {t("advice")}
        </Typography>
        <Typography
          variant="body1"
          color="text.primary"
          fontWeight={500}
          mt={2}
          mb={1}
          sx={{ textTransform: "uppercase" }}
        >
          {t("instruction-patient")}
        </Typography>
        <TextField
          id="le-patient"
          placeholder={t("instruction-placeholder")}
          multiline
          rows={4}
          fullWidth
        />
        <Typography
          variant="body1"
          color="text.primary"
          fontWeight={500}
          mt={4}
          mb={1}
          sx={{ textTransform: "uppercase" }}
        >
          {t("reminder")}
        </Typography>
        <Stack flexDirection="row" alignItems="center" my={2}>
          <Typography variant="body1" color="text.primary" minWidth={150}>
            {t("sms-reminder")}{" "}
          </Typography>
          <FormControl fullWidth size="small">
            <Select id="demo-simple-select" value={age} onChange={handleChange}>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack
          alignItems="center"
          mt={1}
          sx={{ flexDirection: { md: "row", xs: "column" } }}
        >
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label={t("schedule")}
            />
          </FormGroup>
          <Stack alignItems="center" flexDirection="row">
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <Select
                id="demo-simple-select"
                value={age}
                onChange={handleChange}
              >
                <MenuItem value={10}>{t("day")} 1</MenuItem>
                <MenuItem value={20}>{t("day")} 2</MenuItem>
                <MenuItem value={30}>{t("day")} 3</MenuItem>
              </Select>
            </FormControl>{" "}
            <Typography variant="body1" color="text.primary" px={1.2} mt={0}>
              {t("to")}
            </Typography>
            <Box
              sx={{
                "& .MuiOutlinedInput-root": {
                  pr: "6px!important",
                },
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileTimePicker
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SortIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
          </Stack>
        </Stack>
      </Box>
      <Paper
        sx={{
          borderRadius: 0,
          borderWidth: "0px",
          textAlign: "right",
        }}
        className="action"
      >
        <Button
          size="medium"
          variant="text-primary"
          color="primary"
          onClick={() => onClickCancel()}
          sx={{
            mr: 1,
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={() => onNext(2)}
          size="medium"
          variant="contained"
          color="primary"
        >
          {t("next")}
        </Button>
      </Paper>
    </div>
  );
}
export default AddRDVStep2;
