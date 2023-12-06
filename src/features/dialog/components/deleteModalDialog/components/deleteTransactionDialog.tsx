import { Typography } from "@mui/material";
import React from "react";

function DeleteTransactionDialog({ ...props }) {
  const {
    data: { t },
  } = props;
  return <Typography>{t("dialogs.delete-dialog.description")}</Typography>;
}

export default DeleteTransactionDialog;
