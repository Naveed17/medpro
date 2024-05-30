import { MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { DatePicker } from "@features/datepicker";
import React from "react";
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
  const { t, formik } = props;
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
            {t("dialog.stepper.mutual")}{" "}
            <Typography variant="caption" color="error">
              *
            </Typography>
          </Typography>

          <TextField
              value={values.agreement.type || ""}
              onChange={(event) => {
                setFieldValue("agreement", {
                  ...values.agreement,
                  type: event.target.value,
                });
              }}
              placeholder={t("dialog.stepper.placeholder_type")}
          />

        </Stack>
        <Stack spacing={0.5} width={1}>
          <Typography variant="body2" color="text.secondary">
            {t("dialog.stepper.type")}
          </Typography>
          <TextField
            value={values.agreement.type || ""}
            onChange={(event) => {
              setFieldValue("agreement", {
                ...values.agreement,
                type: event.target.value,
              });
            }}
            placeholder={t("dialog.stepper.placeholder_type")}
          />
        </Stack>
      </Stack>
      <Stack width={1} direction="row" alignItems="center" spacing={2}>
        <Stack spacing={0.5} width={1}>
          <Typography variant="body2" color="text.secondary">
            {t("dialog.stepper.start_date")}{" "}
          </Typography>
          <DatePicker
            value={values.agreement.start_date || null}
            onChange={(newValue: any) => {
              setFieldValue("agreement", {
                ...values.agreement,
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
            value={values.agreement.end_date || null}
            onChange={(newValue: any) => {
              setFieldValue("agreement", {
                ...values.agreement,
                end_date: newValue,
              });
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Step1;
