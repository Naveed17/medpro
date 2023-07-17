import { Form, FormikProvider, useFormik } from "formik";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import * as Yup from "yup";
import {
  Box,
  Button,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import RadioTextImage from "@themes/overrides/RadioTextImage";
import { Otable } from "@features/table";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider, TimePicker as MuiTimePicker} from '@mui/x-date-pickers';
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));


const ContentStyled = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: '650px',

}));
const StackStyled = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: theme.spacing(1),
  marginTop: theme.spacing(2),
  marginLeft: theme.spacing(-2),
  position: "sticky",
  bottom: 0,
}));
const BoxStyled = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
}));
const PaperStyled = styled(Form)(({ theme }) => ({
  borderRadius: 0,
  border: "none",
  paddingBottom: theme.spacing(0),
  "& .container": {
    maxHeight: 680,
    overflowY: "auto",
    "& .MuiCard-root": {
      border: "none",
      "& .MuiCardContent-root": {
        padding: theme.spacing(2),
      },
    },
  },
}));

function HolidayDetails({ ...props }) {
  let doctors = [
    {
      id: "1",
      name: "Dr Anas LAOUINI",
      speciality: "sexologist",
      img: "/static/img/men.png",
      selected: false,
    },
    {
      id: "2",
      name: "Dr Omar LAOUINI",
      speciality: "Gynecologist",
      img: "/static/img/men.png",
      selected: false,
    },
    {
      id: "3",
      name: "Dr Anouar ABDELKAFI",
      speciality: "ORL",
      img: "/static/img/men.png",
      selected: false,
    },
  ];
  const [rows, setRows] = useState([
    {
      id: 1,
      name: "Congés",
      start: "Fri April 10",
      time_start: "14:30",
      end: "Fri April 10",
      time_end: "14:30",
      praticien: "Dr Omar OUNELLI",
    },
  ]);

  const { t, ready } = useTranslation("settings");

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, t("holidays.dialog.ttc"))
      .max(50, t("holidays.dialog.ttl"))
      .required(t("holidays.dialog.titlereq")),
    start: Yup.date().required(t("holidays.dialog.datereq")),
    end: Yup.date().required(t("holidays.dialog.datereq")),
  });
  const [value, setValue] = React.useState<Date | null>(
    new Date("2018-01-01T00:00:00.000Z")
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      start: "",
      end: "",
      time_start: new Date("2018-01-01T00:00:00.000Z"),
      time_end: new Date("2018-01-01T00:00:00.000Z"),
      doctor: doctors,
    },
    validationSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

  const {
    values,
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = formik;

  return (
    <FormikProvider value={formik}>
      <PaperStyled
        autoComplete="off"
        noValidate
        className="root"
        onSubmit={handleSubmit}
      >
        <ContentStyled>
          <Typography variant="h6" gutterBottom>
            {t("holidays.dialog.add")}
          </Typography>
          <CardContent>
            <Typography
              variant="body1"
              textTransform={"uppercase"}
              fontWeight={600}
              margin={"16px 0"}
              gutterBottom
            >
              {t("holidays.praticien")}
            </Typography>

            <Typography gutterBottom margin={"16px 0"}>
              {t("holidays.dialog.selectOne")}
            </Typography>

            <Grid container spacing={2}>
              {values.doctor.map((doctor, index) => (
                <Grid key={index} item xs={12} lg={6}>
                  <RadioTextImage
                    doctor={doctor}
                    onChange={(v: any) => {
                      const newArr = values.doctor.map((obj) => {
                        if (obj.id === v.id) {
                          return { ...obj, selected: !v.selected };
                        }
                        return obj;
                      });
                      setFieldValue("doctor", newArr);
                    }}
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>

            <Typography
              variant="body2"
              color="text.primary"
              marginTop={3}
              marginBottom={1}
              gutterBottom
            >
              {t("holidays.dialog.title")}{" "}
              <Typography component="span" color="error">
                *
              </Typography>
            </Typography>
            <TextField
              variant="outlined"
              placeholder={t("holidays.dialog.writeTitle")}
              {...getFieldProps("title")}
              required
              fullWidth
              helperText={touched.title && errors.title}
              error={Boolean(touched.title && errors.title)}
            />

            <Typography
              variant="body2"
              color="text.primary"
              marginTop={3}
              marginBottom={1}
              gutterBottom
            >
              {t("holidays.start")}{" "}
            </Typography>

            <Grid container spacing={2}>
              <Grid key={"date"} item xs={12} lg={5}>
                <TextField
                  id="start"
                  type="date"
                  sx={{ width: "100%" }}
                  {...getFieldProps("start")}
                  helperText={touched.start && errors.start}
                  error={Boolean(touched.start && errors.start)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid key={"at"} item xs={12} lg={1}>
                <Typography
                  gutterBottom
                  textAlign={"center"}
                  alignItems={"center"}
                  margin={1}
                >
                  {t("holidays.dialog.at")}
                </Typography>
              </Grid>
              <Grid key={"time"} item xs={12} lg={5}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MuiTimePicker
                      ampm={false}
                      openTo="hours"
                      views={["hours", "minutes"]}
                      inputFormat="HH:mm"
                      mask="__:__"
                      onChange={(newValue) => {
                        setFieldValue("time_start", newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      value={values.time_start}
                    />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Typography
              variant="body2"
              color="text.primary"
              marginTop={3}
              marginBottom={1}
              gutterBottom
            >
              {t("holidays.end")}{" "}
            </Typography>

            <Grid container spacing={2}>
              <Grid key={"date"} item xs={12} lg={5}>
                <TextField
                  id="date"
                  type="date"
                  sx={{ width: "100%" }}
                  {...getFieldProps("end")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={touched.end && errors.end}
                  error={Boolean(touched.end && errors.end)}
                />
              </Grid>
              <Grid key={"at"} item xs={12} lg={1}>
                <Typography
                  gutterBottom
                  textAlign={"center"}
                  alignItems={"center"}
                  margin={1}
                >
                  {t("holidays.dialog.at")}
                </Typography>
              </Grid>
              <Grid key={"time"} item xs={12} lg={5}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MuiTimePicker
                    ampm={false}
                    openTo="hours"
                    views={["hours", "minutes"]}
                    inputFormat="HH:mm"
                    mask="__:__"
                    onChange={(newValue) => {
                      setFieldValue("time_end", newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    value={values.time_end}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </CardContent>
        </ContentStyled>

        <BoxStyled>
          <Typography variant="body1" fontWeight={600} margin={0} gutterBottom>
            {t("holidays.dialog.list")}
          </Typography>

          <Otable
            headers={[]}
            rows={rows}
            state={null}
            from={"holidays"}
            t={t}
            edit={null}
            handleConfig={null}
            handleChange={null}
          />
        </BoxStyled>

        <StackStyled
          className="bottom-section"
          justifyContent="flex-end"
          spacing={2}
          direction={"row"}
        >
          <Button onClick={() => props.closeDraw()} color="secondary">
            {t("motif.dialog.cancel")}
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {t("motif.dialog.save")}
          </Button>
        </StackStyled>
      </PaperStyled>
    </FormikProvider>
  );
}
export default HolidayDetails;
