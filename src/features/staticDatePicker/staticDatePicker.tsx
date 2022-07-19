import * as React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { styled } from "@mui/material/styles";

const RootStyle = styled(Box)(({ theme }) => ({
  "& .MuiTypography-caption": {
    color: theme.palette.primary.main,
  },
  "& .MuiPickerStaticWrapper-root": {
    backgroundColor: "transparent",
    "& > div > div": {
      backgroundColor: theme.palette.common.white,
    },
  },
  "& .MuiPickersDay-root": {
    borderRadius: "8px",
    "&.MuiPickersDay-today": {
      border: "1px solid transparent",
    },
    "&.Mui-selected": {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.warning.main}`,
      borderRadius: "8px",
      "&:hover, &:focus": {
        backgroundColor: theme.palette.common.white,
        border: `1px solid ${theme.palette.warning.main}`,
      },
    },
    "&:hover, &:focus": {
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${theme.palette.warning.main}`,
    },
    "&.Mui-disabled": {
      color: theme.palette.grey[200],
    },
  },
  "& .MuiCalendarPicker-root > div:first-of-type": {
    position: "relative",
    boxShadow: "0px 0.5px 0px rgba(0, 0, 0, 0.12)",
    backgroundColor: "#FCFCFC",
    minHeight: 46,
    marginBottom: 0,
    marginTop: 0,
    "& .MuiIconButton-edgeEnd": {
      position: "absolute",
      left: 10,
      top: 6,
      color: theme.palette.grey[700],
    },
    "& .MuiIconButton-edgeStart": {
      position: "absolute",
      right: 10,
      top: 6,
      color: theme.palette.grey[700],
    },
    "& > div:first-of-type": {
      fontSize: "1.25rem",
      margin: "0 auto",
      button: {
        display: "none",
      },
    },
    "& > div:last-child": {
      width: 0,
    },
  },
  "& .PrivatePickersSlideTransition-root": {
    minHeight: 250,
  },
}));
export default function StaticDatePickerDemo({ ...props }) {
  const { selected, loading, ...rest } = props;

  return (
    <RootStyle
      sx={{
        ...(loading && {
          maxHeight: "137px",
          overflow: "hidden",
          "& .PrivatePickersSlideTransition-root > div > div:first-of-type > div > div, & .PrivatePickersSlideTransition-root > div > div:first-of-type > div > .MuiButtonBase-root":
            {
              bgcolor: (theme) => theme.palette.grey[600],
              borderRadius: "8px",
              visibility: "visible",
              color: (theme) => theme.palette.grey[600],
              WebkitAnimation:
                "animation-c7515d 1.5s ease-in-out 0.5s infinite",
              animation: "animation-c7515d 1.5s ease-in-out 0.5s infinite",
              "&:hover": {
                borderWidth: 0,
              },
            },
          "& .PrivatePickersSlideTransition-root > div > div:not(:first-of-type) ":
            {
              display: "none",
            },
        }),
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDatePicker
          reduceAnimations
          displayStaticWrapperAs="desktop"
          disablePast
          {...rest}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </RootStyle>
  );
}
