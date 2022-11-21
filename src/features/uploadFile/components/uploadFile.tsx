import { useDropzone } from "react-dropzone";
import React from "react";
// material
import UploadFileStyled from "./overrides/uploadFileStyled";
import { Box, Typography, Stack } from "@mui/material";
import Icon from "@themes/urlIcon";
import { useTranslation } from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function UploadMultiFile({ ...props }) {
  const { t, ready } = useTranslation();
  const { styleprops, singleFile, error, sx, ...other } = props;
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      ...other,
    });
  if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <UploadFileStyled
        {...getRootProps()}
        {...{ styleprops: singleFile?.toString() }}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: "error.main",
            borderColor: "error.light",
            bgcolor: "error.lighter",
          }),
        }}>
        <input {...getInputProps()} />
        {!singleFile ? (
          <Box sx={{ p: 1 }}>
            <Typography sx={{ color: "text.secondary" }}>
              {t("click_or_drop_files_to_upload")}
            </Typography>
          </Box>
        ) : (
          <Stack alignItems="center">
            <Icon path="ic_upload3" />
            <Typography sx={{ color: "text.secondary" }}>
              {t("drag_and_drop_file_here_or_click")}
            </Typography>
          </Stack>
        )}
      </UploadFileStyled>
    </Box>
  );
}
