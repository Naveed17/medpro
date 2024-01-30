import {
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { ImageHandler } from "@features/image";

function Step3({ ...props }) {
  const { t, devise } = props;

  return (
    <Stack
      component={motion.div}
      key="step3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      spacing={2}
      pb={3}
    >
      <Stack>
        <Typography variant="subtitle1" fontWeight={700}>
          {`${t("dialog.stepper.agreement")} STEG`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Elshifa VIP
        </Typography>
      </Stack>
      <List disablePadding>
        <ListItem
          sx={{
            bgcolor: (theme) => theme.palette.info.main,
            borderRadius: 1,
            mb: 0.5,
          }}
        >
          <Typography width={1} variant="body2" color="text.secondary">
            {t("dialog.stepper.start_date")}
          </Typography>
          <Typography width={1} variant="body2" fontWeight={500}>
            30/11/2023
          </Typography>
        </ListItem>
        <ListItem
          sx={{
            bgcolor: (theme) => theme.palette.info.main,
            borderRadius: 1,
            mb: 0.5,
          }}
        >
          <Typography width={1} variant="body2" color="text.secondary">
            {t("dialog.stepper.end_date")}
          </Typography>
          <Typography width={1} variant="body2" fontWeight={500}>
            30/11/2023
          </Typography>
        </ListItem>
        <ListItem
          sx={{
            bgcolor: (theme) => theme.palette.info.main,
            borderRadius: 1,
            mb: 0.5,
          }}
        >
          <Typography width={1} variant="body2" color="text.secondary">
            {t("dialog.stepper.ticket_moderateur_amount")}
          </Typography>
          <Typography width={1} variant="body2" fontWeight={500}>
            0%
          </Typography>
        </ListItem>
        <ListItem
          sx={{
            bgcolor: (theme) => theme.palette.info.main,
            borderRadius: 1,
            mb: 0.5,
          }}
        >
          <Typography width={1} variant="body2" color="text.secondary">
            {t("dialog.stepper.refund_amount")}
          </Typography>
          <Typography width={1} variant="body2" fontWeight={500}>
            100%
          </Typography>
        </ListItem>
      </List>
      <FormControlLabel
        sx={{
          ".MuiTypography-root": {
            fontSize: 16,
          },
        }}
        control={<Checkbox defaultChecked />}
        label={t("dialog.stepper.signed_agreement")}
      />
    </Stack>
  );
}

export default Step3;
