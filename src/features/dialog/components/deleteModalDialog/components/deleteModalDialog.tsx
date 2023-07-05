import { Typography } from "@mui/material";
import React from "react";

function DeleteModalDialog({ ...props }) {
  const {
    data: { t },
  } = props;
  return <Typography>{t("delete-dialog-desc")}</Typography>;
}

export default DeleteModalDialog;
