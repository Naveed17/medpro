import { List, ListItem, Stack, Typography } from "@mui/material";
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
      <Stack direction="row" spacing={1} alignItems="center">
        <ImageHandler
          style={{
            width: 50,
            height: 50,
            objectFit: "contain",
            borderRadius: 0.4,
          }}
          alt={"insurance"}
          src={`/static/img/assurance-1.png`}
        />
        <Typography variant="subtitle1" fontWeight={700}>{`CNAM ${t(
          "dialog.stepper.insurance"
        )}`}</Typography>
      </Stack>
      <List
        disablePadding
        sx={{
          maxHeight: 150,
          overflowY: "auto",
        }}
      >
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
            5,4 {devise}
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
            15 {devise}
          </Typography>
        </ListItem>
        <ListItem
          sx={{
            bgcolor: (theme) => theme.palette.info.main,
            borderRadius: 1,
            mb: 0.5,
            alignItems: "flex-start",
          }}
        >
          <Typography width={1} variant="body2" color="text.secondary">
            APCI
          </Typography>
          <List disablePadding sx={{ width: 1 }}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <Typography width={1} variant="body2" fontWeight={500}>
                1. Diabète insulinodépendant ou non insulinodépendant ne pouvant
                être équilibré par le seul régime.
              </Typography>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <Typography width={1} variant="body2" fontWeight={500}>
                2. Dysthyroïdies.
              </Typography>
            </ListItem>
          </List>
        </ListItem>
      </List>
    </Stack>
  );
}

export default Step3;
