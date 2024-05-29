import {
  Collapse,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { DatePicker } from "@features/datepicker";
import React, { useState } from "react";
import Step2 from "./step2";
const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];
function Step1({ ...props }) {
  const { t, formik, collapse } = props;
  const { values, setFieldValue, errors, touched } = formik;
  return (
    <Stack
      component={motion.div}
      key="step1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      spacing={2}
      pb={5}
    >
      <Stack
        width={1}
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        spacing={2}
      >
        <Stack spacing={0.5} width={1}>
          <Typography variant="body2" color="text.secondary">
            {t("dialog.stepper.insurance")}{" "}
            <Typography variant="caption" color="error">
              *
            </Typography>
          </Typography>

          <Select
            fullWidth
            size={"small"}
            displayEmpty
            sx={{
              maxHeight: 35,
              ...(!!errors.select_insurance && {
                fieldset: {
                  borderColor: "error.main",
                },
              }),
              "& .MuiSelect-select": {
                background: "white",
              },
            }}
            value={values.insurance.select_insurance || ""}
            onChange={(event) => {
              setFieldValue("insurance", {
                ...values.insurance,
                select_insurance: event.target.value,
              });
            }}
            renderValue={(selected) => {
              if (!selected || (selected && selected.length === 0)) {
                return (
                  <Typography color={"gray"}>
                    {t("dialog.stepper.select_insurance")}
                  </Typography>
                );
              }

              return selected;
            }}
          >
            {names.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Stack spacing={0.5} width={1}>
          <Typography variant="body2" color="text.secondary">
            {t("dialog.stepper.description")}
          </Typography>
          <TextField
            value={values.insurance.description}
            onChange={(event) => {
              setFieldValue("insurance", {
                ...values.insurance,
                description: event.target.value,
              });
            }}
            placeholder={t("dialog.stepper.placeholer_description")}
          />
        </Stack>
      </Stack>
      <Stack width={1} direction="row" alignItems="center" spacing={2}>
        <Stack spacing={0.5} width={1}>
          <Typography variant="body2" color="text.secondary">
            {t("dialog.stepper.start_date")}{" "}
          </Typography>
          <DatePicker
            value={values.insurance.start_date || null}
            onChange={(newValue: any) => {
              setFieldValue("insurance", {
                ...values.insurance,
                start_date: newValue,
              });
            }}
          />
        </Stack>
        <Stack spacing={0.5} width={1}>
          <Typography variant="body2" color="text.secondary">
            {t("dialog.stepper.end_date")}
          </Typography>
          <DatePicker
            value={values.insurance.end_date || null}
            onChange={(newValue: any) => {
              setFieldValue("insurance", {
                ...values.insurance,
                end_date: newValue,
              });
            }}
          />
        </Stack>
      </Stack>
      <Collapse in={collapse}>
        <Step2 {...props} />
      </Collapse>
    </Stack>
  );
}

export default Step1;
