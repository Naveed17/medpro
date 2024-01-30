import { Stack, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import React, { useState } from "react";
function Step2({ ...props }) {
  const { t, devise, formik } = props;
  const { values, setFieldValue } = formik;
  console.log(values);
  const [state, setState] = useState({
    ticket_moderateur: "amount",
    ticket_refund: "amount",
  });
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
      <Stack direction="row" spacing={1} width={1}>
        <Stack spacing={0.5} width={1}>
          <Typography variant="body2" color="text.secondary">
            {t("dialog.stepper.ticket_moderateur_amount")}
          </Typography>
          <TextField
            fullWidth
            placeholder={t(
              "dialog.stepper.ticket_moderateur_amount_placeholder"
            )}
            value={values.agreement.ticket_moderateur}
            onChange={(event) => {
              setFieldValue("agreement", {
                ...values.agreement,
                ticket_moderateur: event.target.value,
              });
            }}
          />
        </Stack>
        <Stack
          direction="row"
          border={1}
          borderColor="divider"
          borderRadius={1}
          alignSelf="flex-end"
          bgcolor={(theme) => theme.palette.info.main}
          p={0.5}
        >
          <Typography
            onClick={() => setState({ ...state, ticket_moderateur: "amount" })}
            display="flex"
            variant="body2"
            sx={{
              cursor: "pointer",
              minWidth: 40,
              transition: "all 0.5s ease-in-out",
              transform:
                state.ticket_moderateur === "amount"
                  ? "translateX(0%)"
                  : "translateX(100%)",
            }}
            alignItems="center"
            justifyContent="center"
            p={0.6}
            {...(state.ticket_moderateur === "amount" && {
              bgcolor: (theme) => theme.palette.primary.main,
              color: "common.white",
              borderRadius: 0.7,
            })}
          >
            {devise}
          </Typography>
          <Typography
            onClick={() => setState({ ...state, ticket_moderateur: "percent" })}
            variant="body2"
            display="flex"
            sx={{
              cursor: "pointer",
              minWidth: 40,
              transition: "all 0.5s ease-in-out",
              transform:
                state.ticket_moderateur === "percent"
                  ? "translateX(-100%)"
                  : "translateX(0%)",
            }}
            alignItems="center"
            justifyContent="center"
            p={0.6}
            {...(state.ticket_moderateur === "percent" && {
              bgcolor: (theme) => theme.palette.primary.main,
              color: "common.white",
              borderRadius: 0.7,
            })}
          >
            %
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1} width={1}>
        <Stack spacing={0.5} width={1}>
          <Typography variant="body2" color="text.secondary">
            {t("dialog.stepper.refund_amount")}
          </Typography>
          <TextField
            fullWidth
            placeholder={t(
              "dialog.stepper.ticket_moderateur_amount_placeholder"
            )}
            value={values.agreement.refund_amount}
            onChange={(event) => {
              setFieldValue("agreement", {
                ...values.agreement,
                refund_amount: event.target.value,
              });
            }}
          />
        </Stack>
        <Stack
          direction="row"
          border={1}
          borderColor="divider"
          borderRadius={1}
          alignSelf="flex-end"
          bgcolor={(theme) => theme.palette.info.main}
          p={0.5}
        >
          <Typography
            onClick={() => setState({ ...state, ticket_refund: "amount" })}
            display="flex"
            variant="body2"
            sx={{
              cursor: "pointer",
              minWidth: 40,
              transition: "all 0.5s ease-in-out",
              transform:
                state.ticket_refund === "amount"
                  ? "translateX(0%)"
                  : "translateX(100%)",
            }}
            alignItems="center"
            justifyContent="center"
            p={0.6}
            {...(state.ticket_refund === "amount" && {
              bgcolor: (theme) => theme.palette.primary.main,
              color: "common.white",
              borderRadius: 0.7,
            })}
          >
            {devise}
          </Typography>
          <Typography
            onClick={() => setState({ ...state, ticket_refund: "percent" })}
            variant="body2"
            display="flex"
            sx={{
              cursor: "pointer",
              minWidth: 40,
              transition: "all 0.5s ease-in-out",
              transform:
                state.ticket_refund === "percent"
                  ? "translateX(-100%)"
                  : "translateX(0%)",
            }}
            alignItems="center"
            justifyContent="center"
            p={0.6}
            {...(state.ticket_refund === "percent" && {
              bgcolor: (theme) => theme.palette.primary.main,
              color: "common.white",
              borderRadius: 0.7,
            })}
          >
            %
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Step2;
