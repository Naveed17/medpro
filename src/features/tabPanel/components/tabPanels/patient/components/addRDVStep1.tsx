import React from "react";
import { useTranslation } from "next-i18next";

// material
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

// components
import { StaticDatePicker } from "@features/staticDatePicker";
import { TimeSlot } from "@features/timeSlot";
import { RadioTextImage } from "@features/radioTextImage";
import { PatientCardMobile } from "@features/card/components/patientCardMobile";
import {LoadingScreen} from "@features/loadingScreen";

// select data
const listData = [
  { id: 1, title: "Première consultation", color: "#1BC47D" },
  { id: 2, title: "Consultation de suivi", color: "#0696D6" },
  { id: 3, title: "Troubles de la respiration", color: "#E83B68" },
  { id: 4, title: "Echo", color: "#F1AC44" },
];

// time slot data
const timeData = [
  { time: "8:30", disabled: false },
  { time: "8:45", disabled: false },
  { time: "9:00", disabled: false },
  { time: "9:15", disabled: false },
  { time: "9:30", disabled: false },
  { time: "9:45", disabled: false },
  { time: "10:00", disabled: false },
  { time: "10:15", disabled: false },
];

function AddRDVStep1({ ...props }) {
  const { onNext, onClickCancel } = props;
  const [select, setSelect] = React.useState("");
  const [date, setdate] = React.useState<Date | null>(null);
  const [time, setTime] = React.useState("");
  const [radio, setradio] = React.useState("");

  // handleChange for select
  const handleChange = (event: SelectChangeEvent) => {
    setSelect(event.target.value as string);
  };

  const { t, ready } = useTranslation("patient", {
    keyPrefix: "add-appointment",
  });
  if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

  return (
    <div>
      <Box className="inner-section">
        <Typography variant="h6" color="text.primary">
          {t("book-a-slot")}
        </Typography>
        <Typography variant="body1" color="text.primary" mt={3} mb={1}>
          {t("reason-consultation")}
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={select}
            onChange={handleChange}
            sx={{
              "& .MuiSelect-select svg": {
                display: "none",
              },
            }}
          >
            {listData.map((v) => (
              <MenuItem value={v.id} key={v.id}>
                <FiberManualRecordIcon
                  fontSize="small"
                  sx={{ mr: 1, color: v.color }}
                />{" "}
                {v.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {select && (
          <Box>
            <Typography
              variant="body1"
              color="text.primary"
              fontWeight={500}
              mt={5}
              sx={{ textTransform: "uppercase", fontWeight: 500 }}
            >
              {t("practitioner")}
            </Typography>
            <Typography variant="body1" color="text.primary" my={1}>
              {t("affect-des")}
            </Typography>
            <Grid container spacing={2}>
              {Array.from({ length: 2 }).map((_, index) => (
                <Grid key={index} item xs={12} lg={6}>
                  <RadioTextImage
                    name={`agenda-${index}`}
                    image="/static/img/men.png"
                    type="Dermatologue"
                    onChange={(v: string) => setradio(v)}
                    value={radio}
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Typography
          variant="body1"
          color="text.primary"
          fontWeight={500}
          mt={5}
          mb={0.5}
          sx={{ textTransform: "uppercase", fontWeight: 500 }}
        >
          {t("time-slot")}
        </Typography>
        <Typography variant="body1" color="text.primary" mb={1}>
          {t("date-message")}
        </Typography>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <StaticDatePicker
              onChange={(newDate: Date) => setdate(newDate)}
              value={date}
              loading={!radio}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="body1" color="text.primary" my={2}>
              {t("time-message")}
            </Typography>
            <TimeSlot
              loading={!date}
              data={timeData}
              limit={16}
              onChange={(newTime: string) => setTime(newTime)}
              value={time}
              seeMore
              seeMoreText={t("see-more")}
            />
          </Grid>
        </Grid>

        <Typography variant="body1" color="text.primary" mt={2} mb={1}>
          Selected meetings
        </Typography>
        {[
          {
            status: "warning",
            date: "Fri April 10",
            time: "14:20",
          },
          {
            status: "warning",
            date: "Fri April 10",
            time: "14:20",
          },
        ].map((item, number) => (
          <PatientCardMobile key={number.toString()} item={item} size="small" />
        ))}
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
          onClick={() => onNext(1)}
          size="medium"
          variant="contained"
          color="primary"
          disabled={!time}
        >
          {t("next")}
        </Button>
      </Paper>
    </div>
  );
}
export default AddRDVStep1;
