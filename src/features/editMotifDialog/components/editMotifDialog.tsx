import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import {
  Typography,
  Card,
  CardContent,
  FormHelperText,
  Stack,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ListCheckbox from "@themes/overrides/ListCheckbox";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useRequest, useRequestMutation } from "@app/axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { ModelDot } from "@features/modelDot";
const PaperStyled = styled(Form)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: 0,
  border: "none",
  minWidth: "650px",
  boxShadow: theme.customShadows.motifDialog,
  padding: theme.spacing(2),
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
  "& .bottom-section": {
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
    position: "sticky",
    bottom: 0,
    borderTop: `3px solid ${theme.palette.grey["A700"]}`,
  },
}));
const colors = [
  "#FEBD15",
  "#FF9070",
  "#DF607B",
  "#9A5E8A",
  "#526686",
  "#96B9E8",
  "#0696D6",
  "#56A97F",
];
function EditMotifDialog({ ...props }) {
  const { mutateEvent } = props;
  const { data: session } = useSession();
  const { data: user } = session as Session;
  const router = useRouter();
  const medical_entity = (user as UserDataResponse)
    .medical_entity as MedicalEntityModel;
  const initalData = Array.from(new Array(20));
  const [submit, setSubmit] = useState(false);

  const { trigger } = useRequestMutation(null, "/settings/motif");

  const { t, ready } = useTranslation("settings");

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t("users.new.ntc"))
      .max(50, t("users.new.ntl"))
      .required(t("users.new.nameReq")),
  });

  /*const { data: typesHttpResponse, error: typesHttpError } = useRequest({
        method: "GET",
        url: "/api/public/consultation-reason-types/" + router.locale,
        headers: { Authorization: `Bearer ${session?.accessToken}` }
    });*/

  const { data: httpAgendasResponse, error: errorHttpAgendas } = useRequest({
    method: "GET",
    url: `/api/medical-entity/${medical_entity.uuid}/agendas/${router.locale}`,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  const agendas = httpAgendasResponse
    ? (httpAgendasResponse as HttpResponse).data
    : [];
  //const types = typesHttpResponse ? (typesHttpResponse as HttpResponse).data : [];

  /*    let typesUiids: string[] = [];
        if (props.data) {
            props.data.types.map((type: ConsultationReasonTypeModel) => typesUiids.push(type.uuid))
        }*/
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: props.data ? (props.data.name as string) : "",
      color: props.data ? (props.data.color as string) : "#0696D6",
      duration: props.data ? props.data.duration : "",
      minimumDelay: props.data ? props.data.minimumDelay : "",
      maximumDelay: props.data ? props.data.maximumDelay : "",
      //typeOfMotif: typesUiids,
      agendas: props.data ? props.data.agenda : [],
    },
    validationSchema,

    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setSubmit(true);
      //if (values.typeOfMotif.length > 0) {
      props.closeDraw();
      const form = new FormData();
      form.append("color", values.color);
      form.append(
        "translations",
        JSON.stringify({
          fr: values.name,
        })
      );
      form.append("duration", values.duration);
      let selectedTypes = "";
      let selectedAgendas = "";
      //values.typeOfMotif.map((typ) => selectedTypes += typ + ',')
      values.agendas.map((ang: string) => (selectedAgendas += ang + ","));
      form.append("type", selectedTypes.substring(0, selectedTypes.length - 1));
      form.append(
        "agendas",
        selectedAgendas.substring(0, selectedAgendas.length - 1)
      );
      form.append("delay_min", values.minimumDelay);
      form.append("delay_max", values.maximumDelay);
      form.append("is_enabled", props.data ? props.data.isEnabled : "true");
      if (props.data) {
        trigger(
          {
            method: "PUT",
            url:
              "/api/medical-entity/" +
              medical_entity.uuid +
              "/consultation-reasons/" +
              props.data.uuid +
              "/" +
              router.locale,
            data: form,
            headers: {
              ContentType: "application/x-www-form-urlencoded",
              Authorization: `Bearer ${session?.accessToken}`,
            },
          },
          { revalidate: true, populateCache: true }
        ).then((r: any) => mutateEvent());
      } else {
        trigger(
          {
            method: "POST",
            url:
              "/api/medical-entity/" +
              medical_entity.uuid +
              "/consultation-reasons/" +
              router.locale,
            data: form,
            headers: {
              ContentType: "application/x-www-form-urlencoded",
              Authorization: `Bearer ${session?.accessToken}`,
            },
          },
          { revalidate: true, populateCache: true }
        ).then((r: any) => mutateEvent());
      }
    },
  });

  if (!ready) return <>loading translations...</>;

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
        onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          {props.data ? t("motif.dialog.update") : t("motif.dialog.add")}
        </Typography>
        <Typography
          variant="body1"
          fontWeight={400}
          margin={"16px 0"}
          gutterBottom>
          {t("motif.dialog.info")}
        </Typography>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack>
                <Typography
                  display="flex"
                  justifyContent="flex-start"
                  variant="body2"
                  color="text.secondary"
                  gutterBottom>
                  {t("motifType.dialog.color")}{" "}
                  <Typography component="span" color="error" ml={0.2}>
                    *
                  </Typography>
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  {colors.map((color) => (
                    <ModelDot
                      key={color}
                      color={color}
                      onClick={() => {
                        setFieldValue("color", color);
                      }}
                      selected={color === values.color}></ModelDot>
                  ))}
                </Stack>
                {touched.color && errors.color && (
                  <FormHelperText error sx={{ mx: 0 }}>
                    {Boolean(touched.color && errors.color)}
                  </FormHelperText>
                )}
              </Stack>
              <Stack>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t("motif.dialog.nom")}{" "}
                  <Typography component="span" color="error">
                    *
                  </Typography>
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder={t("motif.dialog.tapez")}
                  required
                  fullWidth
                  helperText={touched.name && errors.name}
                  {...getFieldProps("name")}
                  error={Boolean(touched.name && errors.name)}
                />
              </Stack>
              <FormControl size="small" fullWidth>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t("motif.dialog.duree")}
                </Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id={"duration"}
                  {...getFieldProps("duration")}
                  displayEmpty={true}
                  sx={{ color: "text.secondary" }}>
                  <MenuItem key={"0"} value={0}>
                    -
                  </MenuItem>
                  {props.durations.map((duration: DurationModel) => (
                    <MenuItem key={duration.value} value={duration.value}>
                      {duration.date +
                        " " +
                        t("common:times." + duration.unity)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Stack spacing={2} direction={{ xs: "column", lg: "row" }}>
                <Box width={1}>
                  <FormControl size="small" fullWidth>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom>
                      {t("motif.dialog.delaiMin")}
                    </Typography>
                    <Select
                      labelId="demo-simple-select-label"
                      id={"minimumDelay"}
                      {...getFieldProps("minimumDelay")}
                      value={values.minimumDelay}
                      displayEmpty={true}
                      sx={{ color: "text.secondary" }}>
                      <MenuItem key={"0"} value={0}>
                        -
                      </MenuItem>
                      {props.delay.map((duration: DurationModel) => (
                        <MenuItem key={duration.value} value={duration.value}>
                          {duration.date +
                            " " +
                            t("common:times." + duration.unity)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box width={1}>
                  <FormControl size="small" fullWidth>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom>
                      {t("motif.dialog.delaiMax")}
                    </Typography>
                    <Select
                      labelId="demo-simple-select-label"
                      id={"maximumDelay"}
                      {...getFieldProps("maximumDelay")}
                      displayEmpty={true}
                      sx={{ color: "text.secondary" }}>
                      <MenuItem key={"0"} value={0}>
                        -
                      </MenuItem>
                      {props.delay.map((duration: DurationModel) => (
                        <MenuItem key={duration.value} value={duration.value}>
                          {duration.date +
                            " " +
                            t("common:times." + duration.unity)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        {/*<Box mt={2}>
                    <Typography variant="body1" color={values.typeOfMotif.length == 0 && submit ? 'error' : ''}
                        fontWeight={400} margin={'16px 0'} gutterBottom>
                        {t('motif.dialog.type')}
                        <Typography component="span" color="error">
                            *
                        </Typography>
                    </Typography>

                    <Card>
                        <CardContent>
                            {types.length === 0 ? initalData.map((item, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', margin: '0 5px' }}>
                                    <Checkbox size="small" />
                                    <Skeleton width={180} variant="text" />
                                </Box>
                            )) :
                                (types as ConsultationReasonModel[]).map((item, index) => (
                                    <ListCheckbox key={index} data={item}
                                        checked={values.typeOfMotif.includes(item.uuid)}
                                        onChange={(v: any) => {
                                            const i = values.typeOfMotif.findIndex(typ => item.uuid === typ);
                                            setFieldValue('typeOfMotif', i < 0 ? [...values.typeOfMotif, item.uuid] : [...values.typeOfMotif.slice(0, i), ...values.typeOfMotif.slice(i + 1, values.typeOfMotif.length)]);
                                        }} />
                                ))
                            }
                        </CardContent>
                    </Card>
                </Box>*/}
        <Box mt={2}>
          <Typography
            variant="body1"
            fontWeight={400}
            margin={"16px 0"}
            gutterBottom>
            {t("motif.dialog.agenda")}
          </Typography>

          <Card>
            <CardContent>
              {(agendas as AgendaConfigurationModel[]).map((item, index) => (
                <ListCheckbox
                  key={index}
                  data={item}
                  checked={values.agendas.includes(item.uuid)}
                  onChange={() => {
                    const i = values.agendas.findIndex(
                      (ang: string) => item.uuid === ang
                    );
                    setFieldValue(
                      "agendas",
                      i < 0
                        ? [...values.agendas, item.uuid]
                        : [
                            ...values.agendas.slice(0, i),
                            ...values.agendas.slice(
                              i + 1,
                              values.agendas.length
                            ),
                          ]
                    );
                  }}
                />
              ))}
            </CardContent>
          </Card>
          {/*<Card>
                        <CardContent>
                            <Typography gutterBottom margin={'16px 0'}>{t('motif.dialog.selectCalander')}</Typography>
                            <Grid container spacing={2}>
                                {values.doctor.map((doctor, index) => (
                                    <Grid key={index} item xs={12} lg={6}>
                                        <RadioTextImage
                                            doctor={doctor}
                                            onChange={(v: any) => {
                                                const newArr = values.doctor.map(obj => {
                                                    if (obj.id === v.id) {
                                                        return {...obj, selected: !v.selected};
                                                    }
                                                    return obj;
                                                });
                                                setFieldValue('doctor', newArr)
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>*/}
        </Box>

        <div style={{ height: 70 }}></div>

        <Stack
          className="bottom-section"
          justifyContent="flex-end"
          spacing={2}
          direction={"row"}>
          <Button onClick={props.closeDraw}>{t("motif.dialog.cancel")}</Button>
          <Button type="submit" variant="contained" color="primary">
            {t("motif.dialog.save")}
          </Button>
        </Stack>
      </PaperStyled>
    </FormikProvider>
  );
}

export default EditMotifDialog;
