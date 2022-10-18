import React from "react";
import { Avatar, TextField, Typography, Stack } from "@mui/material";
import RootStyled from "./overrides/rootSyled";
import { Label } from "@features/label";
import { useTranslation } from "next-i18next";
function EndConsultationDialog({ ...props }) {
  const {
    data: { t },
  } = props;

  const imgUrl = null;
  return (
    <RootStyled>
      <Stack
        alignItems="center"
        spacing={2}
        maxWidth={{ xs: "100%", md: "80%" }}
        mx="auto"
        width={1}>
        <Typography variant="subtitle1">
          {t("end_of_consultation_with")}
        </Typography>
        <Avatar
          {...(imgUrl
            ? { src: imgUrl }
            : { src: "/static/icons/ic-avatar-f.svg" })}
        />
        <Typography variant="subtitle1" fontWeight={700} color="white.darker">
          Test
        </Typography>
        <Typography variant="subtitle2">
          {t("price_of_the_consultation")}{" "}
          <Label
            variant="filled"
            color="success"
            sx={{ color: (theme) => theme.palette.text.primary }}>
            <Typography
              color="text.primary"
              variant="subtitle1"
              fontWeight={600}
              mr={0.3}>
              120
            </Typography>
            TND
          </Label>
        </Typography>
        <TextField
          fullWidth
          multiline
          value={
            "Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum. Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit"
          }
          rows={4}
          inputProps={{
            readOnly: true,
          }}
        />
      </Stack>
    </RootStyled>
  );
}

export default EndConsultationDialog;
