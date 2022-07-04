import React from "react";
import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import { useTranslation } from "next-i18next";
const data = {
  personal: [
    {
      name: "group",
      value: "groupe x",
    },
    {
      name: "region",
      value: "Ariana",
    },
    {
      name: "civility",
      value: "Mr",
    },
    {
      name: "address",
      value: "2 ruse murabites menzah 5 ",
    },
    {
      name: "name",
      value: "Khadija EHA",
    },
    {
      name: "zip",
      value: "1004",
    },
    {
      name: "date-of-birth",
      value: "29 juin 1989",
    },
    {
      name: "assurance",
      value: "",
    },
    {
      name: "telephone",
      value: "+216 22 469 495",
    },
    {
      name: "cin",
      value: "",
    },
    {
      name: "email",
      value: "",
    },
    {
      name: "from",
      value: "",
    },
  ],
};
export default function PersonalInfo() {
  const { t, ready } = useTranslation("patient", { keyPrefix: "add-patient" });
  if (!ready) return <div>Loading...</div>;
  return (
    <Box
      component="nav"
      sx={{
        p: 1,
      }}
    >
      <Typography
        variant="body1"
        color="text.primary"
        fontFamily="Poppins"
        sx={{ my: 1 }}
      >
        {t("personal-info")}
      </Typography>
      <Paper sx={{ p: 1.5 }}>
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
                  {v.value}
                </Typography>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}