import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const RootStyled = styled(Box)(({ theme }) => ({
  "& .MuiTypography-caption": {
    color: theme.palette.primary.main,
  },
  "& .MuiPickerStaticWrapper-root": {
    backgroundColor: "transparent",
    "& > div > div": {
      backgroundColor: theme.palette.common.white,
    },
  },
  "& .PrivatePickersYear-yearButton": {
    borderRadius: "8px",
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
  },
  "& .MuiPickersDay-root": {
    borderRadius: "8px",
    "&.MuiPickersDay-today": {
      border: `1px solid ${theme.palette.warning.main}`
    },
    "&.Mui-selected": {
      border: `1px solid ${theme.palette.warning.main}`,
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.warning.main,
      borderRadius: "8px",
      "&:hover, &:focus": {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.warning.main,
      },
      "&.Mui-disabled": {
        color: theme.palette.text.primary,
      },
    },
    "&:hover, &:focus": {
      backgroundColor: theme.palette.grey["A700"],
    },
    "&.Mui-disabled": {
      color: theme.palette.divider,
    },
  },
  "& .MuiCalendarPicker-root > div:first-of-type": {
    position: "relative",
    boxShadow: "0px 0.5px 0px rgba(0, 0, 0, 0.12)",
    backgroundColor: theme.palette.grey["A800"],
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
  "&.loading": {
    maxHeight: "137px",
    overflow: "hidden",
    "& .PrivatePickersSlideTransition-root > div > div:first-of-type > div > div, & .PrivatePickersSlideTransition-root > div > div:first-of-type > div > .MuiButtonBase-root":
      {
        backgroundColor: theme.palette.grey[100],
        borderRadius: "8px",
        visibility: "visible",
        color: theme.palette.grey[100],
        WebkitAnimation: "animation-c7515d 1.5s ease-in-out 0.5s infinite",
        animation: "animation-c7515d 1.5s ease-in-out 0.5s infinite",
        "&:hover": {
          borderWidth: 0,
        },
      },
    "& .PrivatePickersSlideTransition-root > div > div:not(:first-of-type) ": {
      display: "none",
    },
  },
}));
export default RootStyled;
