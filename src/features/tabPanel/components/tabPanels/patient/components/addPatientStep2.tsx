import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import {
  Typography,
  Box,
  FormControl,
  TextField,
  Grid,
  Button,
  Select,
  MenuItem,
  Stack,
  IconButton,
} from "@mui/material";
import Icon from "@themes/urlIcon";
import LoadingButton from "@mui/lab/LoadingButton";
import { addPatientSelector } from "@features/tabPanel";
import { useAppSelector } from "@app/redux/hooks";
import _ from "lodash";
import { useSession } from "next-auth/react";
import { useRequestMutation } from "@app/axios";
import { Session } from "next-auth";

interface insuranceProps {
  name: string;
  id: string | number;
}

function AddPatientStep2({ ...props }) {
  const { onNext, t, onAddPatient } = props;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(status === "loading");
  const { stepsData } = useAppSelector(addPatientSelector);
  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email Required"),
  });

  const { data: user } = session as Session;
  const medical_entity = (user as UserDataResponse)
    .medical_entity as MedicalEntityModel;

  const { data: httpAddPatientResponse, trigger } = useRequestMutation(
    null,
    "add-patient",
    { revalidate: true, populateCache: false }
  );

  const formik = useFormik({
    initialValues: {
      region: "",
      zip_code: "",
      address: "",
      email: "",
      cin: "",
      from: "",
      insurance: [] as insuranceProps[],
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      handleChange(null, values);
    },
  });

  const handleChange = (event: ChangeEvent | null, { ...values }) => {
    const { first_name, last_name, birthdate, phone, gender } = stepsData.step1;
    const { day, month, year } = birthdate;

    setLoading(true);
    trigger(
      {
        method: "POST",
        url: `/api/medical-entity/${medical_entity.uuid}/patients/${router.locale}`,
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        data: {
          first_name,
          last_name,
          phone,
          gender,
          birthdate: `${day}-${month}-${year}`,
          ...values,
          address: "",
          insurance: "",
        },
      },
      { revalidate: true, populateCache: true }
    ).then((res: any) => {
      const { data } = res;
      const { status } = data;
      setLoading(false);
      if (status === "success") {
        onNext(2);
        onAddPatient();
      }
    });
  };
  const { values, handleSubmit, getFieldProps, touched, errors } = formik;
  const handleAddInsurance = () => {
    const insurance = [...values.insurance, { name: "", number: "" }];
    formik.setFieldValue("insurance", insurance);
  };
  const handleRemoveInsurance = (index: number) => {
    const insurance = [...values.insurance];
    insurance.splice(index, 1);
    formik.setFieldValue("insurance", insurance);
  };

  return (
    <FormikProvider value={formik}>
      <Stack
        sx={{ height: "100%" }}
        component={Form}
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="inner-section">
          <Stack spacing={2}>
            <Typography mt={1} variant="h6" color="text.primary">
              {t("add-patient.additional-information")}
            </Typography>
            <div>
              <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {t("add-patient.region")}
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      labelId="demo-simple-select-label"
                      id={"region"}
                      size="small"
                      {...getFieldProps("region")}
                      value={values.region}
                      displayEmpty={true}
                      sx={{ color: "text.secondary" }}
                      renderValue={(value) =>
                        value?.length
                          ? Array.isArray(value)
                            ? value.join(", ")
                            : value
                          : t("add-patient.region-placeholder")
                      }
                    >
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="3">3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {t("add-patient.zip")}
                  </Typography>
                  <TextField
                    variant="outlined"
                    placeholder="10004"
                    size="small"
                    fullWidth
                    {...getFieldProps("zip_code")}
                  />
                </Grid>
              </Grid>
            </div>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t("add-patient.address")}
              </Typography>
              <TextField
                variant="outlined"
                multiline
                rows={3}
                placeholder={t("add-patient.address-placeholder")}
                size="small"
                fullWidth
                {...getFieldProps("address")}
              />
            </Box>
            <Box>
              <Typography sx={{ mb: 1.5, textTransform: "capitalize" }}>
                <IconButton
                  onClick={handleAddInsurance}
                  className="success-light"
                  sx={{
                    mr: 1.5,
                    "& svg": {
                      width: 20,
                      height: 20,
                    },
                  }}
                >
                  <Icon path="ic-plus" />
                </IconButton>
                {t("add-patient.assurance")}
              </Typography>
              <Box>
                {values.insurance.map((val, index: number) => (
                  <Grid
                    key={Math.random()}
                    container
                    spacing={2}
                    sx={{ mt: index > 0 ? 1 : 0 }}
                  >
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <Select
                          id={"assurance"}
                          size="small"
                          {...getFieldProps(`insurance[${index}].name`)}
                          value={values.insurance[index]?.name}
                          displayEmpty={true}
                          sx={{ color: "text.secondary" }}
                          renderValue={(value) =>
                            value?.length
                              ? Array.isArray(value)
                                ? value.join(", ")
                                : value
                              : t("add-patient.assurance")
                          }
                        >
                          <MenuItem value="1">1</MenuItem>
                          <MenuItem value="2">2</MenuItem>
                          <MenuItem value="3">3</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Stack direction="row" spacing={2}>
                        <TextField
                          variant="outlined"
                          placeholder={t("add-patient.assurance-phone-error")}
                          size="small"
                          fullWidth
                          {...getFieldProps(`insurance[${index}].number`)}
                        />
                        <IconButton
                          onClick={() => handleRemoveInsurance(index)}
                          className="error-light"
                          sx={{
                            mr: 1.5,
                            "& svg": {
                              width: 20,
                              height: 20,
                              "& path": {
                                fill: (theme) => theme.palette.text.primary,
                              },
                            },
                          }}
                        >
                          <Icon path="ic-moin" />
                        </IconButton>
                      </Stack>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t("add-patient.email")}
              </Typography>
              <TextField
                placeholder={t("add-patient.email-placeholder")}
                type="email"
                variant="outlined"
                size="small"
                fullWidth
                {...getFieldProps("email")}
                error={Boolean(touched.email && errors.email)}
                helperText={
                  Boolean(touched.email && errors.email)
                    ? String(errors.email)
                    : undefined
                }
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t("add-patient.cin")}
              </Typography>
              <TextField
                placeholder={t("add-patient.cin-placeholder")}
                variant="outlined"
                size="small"
                fullWidth
                {...getFieldProps("cin")}
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t("add-patient.from")}
              </Typography>
              <TextField
                placeholder={t("add-patient.from-placeholder")}
                type="text"
                variant="outlined"
                size="small"
                fullWidth
                {...getFieldProps("from")}
              />
            </Box>
          </Stack>
        </div>
        <Stack
          spacing={3}
          direction="row"
          justifyContent="flex-end"
          className="action"
        >
          <Button
            variant="text-black"
            color="primary"
            onClick={() => onNext(0)}
          >
            {t("add-patient.return")}
          </Button>

          <LoadingButton
            type="submit"
            color="primary"
            loading={loading}
            variant="contained"
          >
            {t("add-patient.register")}
          </LoadingButton>
        </Stack>
      </Stack>
    </FormikProvider>
  );
}
export default AddPatientStep2;
