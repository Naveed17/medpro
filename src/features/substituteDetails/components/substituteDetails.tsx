import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { Typography, Stack, TextField, Grid, Button } from '@mui/material'
import { styled } from '@mui/material/styles';
import React from "react";
import { useTranslation } from "next-i18next";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { TimePicker as MuiTimePicker } from "@mui/lab";

const PaperStyled = styled(Form)(({ theme }) => ({

  backgroundColor: theme.palette.background.default,
  borderRadius: 0,
  height: '100%',
  border: 'none',
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(0),
  '& .container': {
    maxHeight: 680,
    overflowY: 'auto',
    '& .MuiCard-root': {
      border: 'none',
      '& .MuiCardContent-root': {
        padding: theme.spacing(2),
      }
    }
  },
  '& .bottom-section': {
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
    position: 'absolute',
    width: '100%',
    bottom: 0,
    borderTop: `3px solid ${theme.palette.grey["A700"]}`,
  }
}));

function SubstituteDetails({ ...props }) {

  const { t, ready } = useTranslation('settings');

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('users.new.ntc'))
      .max(50, t('users.new.ntl'))
      .required(t('users.new.nameReq')),
    email: Yup.string().email(t('users.new.mailInvalid')).required(t('users.new.mailReq'))
  });


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
      name: '',
      start: '',
      end: '',
      time_start: new Date('2018-01-01T00:00:00.000Z'),
      time_end: new Date('2018-01-01T00:00:00.000Z')
    },
    validationSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  if (!ready) return (<>loading translations...</>);

  const types = [
    { id: 1, text: t('motif.dialog.enligne'), name: 'teleconsult' },
    { id: 2, text: t('motif.dialog.cabinet'), name: 'cabinet' },
    { id: 3, text: t('motif.dialog.domicile'), name: 'domicile' },
    { id: 4, text: t('motif.dialog.pro'), name: 'professionnels' },
  ]

  const { values, errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <PaperStyled autoComplete="off"
        noValidate
        className='root'
        onSubmit={handleSubmit}>

        <Typography variant="h6" gutterBottom>
          {props.data ? t('motif.dialog.update') : t('substitute.add')}
        </Typography>
        <Typography variant="body1" fontWeight={400} margin={'16px 0'} gutterBottom>
          {t('substitute.info')}
        </Typography>

        <Typography variant="body2" sx={{ margin: '20px 0 10px' }} gutterBottom>
          {t('substitute.mail')}{" "}
          <Typography component="span" color="error">
            *
          </Typography>
        </Typography>
        <TextField
          variant="outlined"
          placeholder={t('exemple@mail.com')}
          required
          fullWidth
          helperText={touched.email && errors.email}
          {...getFieldProps("email")}
          error={Boolean(touched.email && errors.email)} />

        <Typography variant="body2" sx={{ margin: '20px 0 10px' }} gutterBottom>
          {t('substitute.name')}{" "}
          <Typography component="span" color="error">
            *
          </Typography>
        </Typography>
        <TextField
          variant="outlined"
          placeholder={t('substitute.tname')}
          required
          fullWidth
          helperText={touched.name && errors.name}
          {...getFieldProps("name")}
          error={Boolean(touched.name && errors.name)}

        />

        <Typography variant="body2" color="text.primary" marginTop={3} marginBottom={1} gutterBottom>
          {t('holidays.start')}{" "}
        </Typography>

        <Grid container spacing={2}>
          <Grid key={'date'} item xs={12} lg={5}>
            <TextField
              id="start"
              type="date"
              sx={{ width: '100%' }}
              {...getFieldProps("start")}
              helperText={touched.start && errors.start}
              error={Boolean(touched.start && errors.start)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid key={'at'} item xs={12} lg={2}>
            <Typography gutterBottom textAlign={"center"} alignItems={"center"} margin={1}>
              {t('holidays.dialog.at')}
            </Typography>
          </Grid>
          <Grid key={'time'} item xs={12} lg={5}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MuiTimePicker
                  ampm={false}
                  openTo="hours"
                  views={["hours", "minutes"]}
                  inputFormat="HH:mm"
                  mask="__:__"
                  onChange={(newValue) => {
                    setFieldValue('time_start', newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  value={values.time_start} />
              </LocalizationProvider>
            </LocalizationProvider>
          </Grid>
        </Grid>

        <Typography variant="body2" color="text.primary" marginTop={3} marginBottom={1} gutterBottom>
          {t('holidays.end')}{" "}
        </Typography>

        <Grid container spacing={2}>
          <Grid key={'date'} item xs={12} lg={5}>
            <TextField
              id="date"
              type="date"
              sx={{ width: '100%' }}
              {...getFieldProps("end")}
              InputLabelProps={{
                shrink: true,
              }}
              helperText={touched.end && errors.end}
              error={Boolean(touched.end && errors.end)}
            />
          </Grid>
          <Grid key={'at'} item xs={12} lg={2}>
            <Typography gutterBottom textAlign={"center"} alignItems={"center"} margin={1}>
              {t('holidays.dialog.at')}
            </Typography>
          </Grid>
          <Grid key={'time'} item xs={12} lg={5}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MuiTimePicker
                ampm={false}
                openTo="hours"
                views={["hours", "minutes"]}
                inputFormat="HH:mm"
                mask="__:__"
                onChange={(newValue) => {
                  setFieldValue('time_end', newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
                value={values.time_end} />
            </LocalizationProvider>
          </Grid>
        </Grid>

        <Stack className='bottom-section' justifyContent='flex-end' spacing={2} direction={'row'}>
          <Button onClick={props.closeDraw}>
            {t('motif.dialog.cancel')}
          </Button>
          <Button type='submit' variant="contained" color="primary">
            {t('motif.dialog.save')}
          </Button>
        </Stack>

      </PaperStyled>
    </FormikProvider>
  )
}

export default SubstituteDetails;
