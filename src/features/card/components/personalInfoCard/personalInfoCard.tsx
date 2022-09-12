import React from "react";
// hook
import { useTranslation } from "next-i18next";

// material
import { Box, Typography, Paper, Grid, Skeleton } from "@mui/material";

// dumy data
const data = {
  personal: [
    // {
    //   name: "group",
    //   value: "groupe x",
    // },
    // {
    //   name: "region",
    //   value: "Ariana",
    // },
    // {
    //   name: "civility",
    //   value: "Mr",
    // },
    // {
    //   name: "address",
    //   value: "2 ruse murabites menzah 5 ",
    // },
    {
      name: "name",
      value: "Test",
    },
    // {
    //   name: "zip",
    //   value: "1004",
    // },
    {
      name: "birthdate",
      value: "29 juin 1989",
    },
    // {
    //   name: "assurance",
    //   value: "",
    // },
    // {
    //   name: "telephone",
    //   value: "+216 22 469 495",
    // },
    // {
    //   name: "cin",
    //   value: "",
    // },
    {
      name: "email",
      value: "",
    },
    // {
    //   name: "from",
    //   value: "",
    // },
  ],
};
function PersonalInfo({ ...props }) {
  const { patient, loading } = props;
  const { t, ready } = useTranslation("patient", { keyPrefix: "add-patient" });
  if (!ready) return <div>Loading...</div>;
  return (
    <Box>
      <Typography
        variant="body1"
        color="text.primary"
        fontFamily="Poppins"
        sx={{ my: 1 }}
      >
        {loading ? (
          <Skeleton variant="text" sx={{ maxWidth: 200 }} />
        ) : (
          t("personal-info")
        )}
      </Typography>
      <Paper sx={{ p: 1.5, borderWidth: 0 }}>
        <Grid container spacing={1.2}>
          {data.personal.map((v) => (
            <React.Fragment key={Math.random()}>
              <Grid item md={3} sm={6} xs={6}>
                <Typography variant="body1" color="text.secondary" noWrap>
                  {t(v.name)}
                </Typography>
              </Grid>
              <Grid item md={3} sm={6} xs={6}>
                <Typography variant="body1" color="text.primary" noWrap>
                  {loading ? (
                    <Skeleton variant="text" />
                  ) : v.name === "name" ? (
                    <>
                      {patient.firstName} {patient.firstName}
                    </>
                  ) : (
                    patient[v.name]
                  )}
                </Typography>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
export default PersonalInfo;
