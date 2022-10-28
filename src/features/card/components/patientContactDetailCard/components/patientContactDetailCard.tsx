import React from "react";
import RootStyled from "./overrides/rootStyle";
import {
  Typography,
  Skeleton,
  CardContent,
  Grid,
  Stack,
  Box,
  InputBase,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useFormik, Form, FormikProvider } from "formik";
function PatientContactDetailCard({ ...props }) {
  const { patient, loading } = props;
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      address:
        !loading && patient?.address[0] ? patient?.address[0].street : "--",
      telephone:
        !loading && patient.contact.length > 0
          ? `${patient.contact[0].code ? patient.contact[0].code : ""}${
              patient.contact[0].value
            }`
          : "--",
      email: !loading && patient.email ? patient.email : "--",
      region:
        !loading && patient?.address[0] ? patient?.address[0].city.name : "--",
      postalCode:
        !loading && patient?.address[0] ? patient?.address[0].postalCode : "--",
    },
    onSubmit: async (values) => {
      console.log("ok", values);
    },
  });
  const { handleSubmit, values, getFieldProps } = formik;

  const { t, ready } = useTranslation("patient", {
    keyPrefix: "config.add-patient",
  });
  if (!ready) return <div>Loading...</div>;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate>
        <Typography
          variant="body1"
          color="text.primary"
          fontFamily="Poppins"
          gutterBottom>
          {loading ? (
            <Skeleton variant="text" sx={{ maxWidth: 200 }} />
          ) : (
            t("contact")
          )}
        </Typography>
        <RootStyled>
          <CardContent>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  {patient?.contact.map(
                    (contact: ContactModel, index: number) => (
                      <Stack
                        direction="row"
                        key={index}
                        alignItems="flex-start">
                        <Typography
                          className="label"
                          variant="body2"
                          color="text.secondary"
                          width="50%">
                          {t("telephone")}
                        </Typography>
                        {loading ? (
                          <Skeleton width={100} />
                        ) : (
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center">
                            <Box
                              component="img"
                              src={`https://flagcdn.com/w20/tn.png`}
                              srcSet={`https://flagcdn.com/w40/tn.png 2x`}
                              sx={{ width: 22 }}
                            />
                            <InputBase
                              sx={{ width: "50%" }}
                              inputProps={{
                                style: {
                                  background: "white",
                                  fontSize: 14,
                                },
                              }}
                              {...getFieldProps("telephone")}
                            />
                          </Stack>
                        )}
                      </Stack>
                    )
                  )}
                  <Stack direction="row" alignItems="flex-start">
                    <Typography
                      className="label"
                      variant="body2"
                      color="text.secondary"
                      width="50%">
                      {t("email")}
                    </Typography>
                    {loading ? (
                      <Skeleton width={100} />
                    ) : (
                      <InputBase
                        sx={{ width: "50%" }}
                        inputProps={{
                          style: {
                            background: "white",
                            fontSize: 14,
                          },
                        }}
                        {...getFieldProps("email")}
                      />
                    )}
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="flex-start">
                    <Typography
                      className="label"
                      variant="body2"
                      color="text.secondary"
                      width="50%">
                      {t("region")}
                    </Typography>
                    {loading ? (
                      <Skeleton width={100} />
                    ) : (
                      <InputBase
                        sx={{ width: "50%" }}
                        inputProps={{
                          style: {
                            background: "white",
                            fontSize: 14,
                          },
                        }}
                        {...getFieldProps("region")}
                      />
                    )}
                  </Stack>
                  <Stack direction="row" alignItems="flex-start">
                    <Typography
                      className="label"
                      variant="body2"
                      color="text.secondary"
                      width="50%">
                      {t("address")}
                    </Typography>
                    {loading ? (
                      <Skeleton width={100} />
                    ) : (
                      <InputBase
                        sx={{ width: "50%" }}
                        inputProps={{
                          style: {
                            background: "white",
                            fontSize: 14,
                          },
                        }}
                        {...getFieldProps("address")}
                      />
                    )}
                  </Stack>
                  <Stack direction="row" alignItems="flex-start">
                    <Typography
                      className="label"
                      variant="body2"
                      color="text.secondary"
                      width="50%">
                      {t("zip_code")}
                    </Typography>
                    {loading ? (
                      <Skeleton width={100} />
                    ) : (
                      <InputBase
                        sx={{ width: "50%" }}
                        inputProps={{
                          style: {
                            background: "white",
                            fontSize: 14,
                          },
                        }}
                        {...getFieldProps("postalCode")}
                      />
                    )}
                  </Stack>
                  {patient?.insurances.map(
                    (data: { insurance: InsuranceModel }, index: number) => (
                      <Stack
                        direction="row"
                        key={index}
                        alignItems="flex-start">
                        <Typography
                          className="label"
                          variant="body2"
                          color="text.secondary"
                          width="50%">
                          {t("assurance")}
                        </Typography>
                        {loading ? (
                          <Skeleton width={100} />
                        ) : (
                          <Typography width="50%">
                            {data.insurance.name}
                          </Typography>
                        )}
                      </Stack>
                    )
                  )}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </RootStyled>
      </Form>
    </FormikProvider>
  );
}

export default PatientContactDetailCard;
