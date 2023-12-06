import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { MobileContainer } from "@lib/constants";

const BoxStyled = styled(Box)(({ theme }) => ({
  [`@media (min-width:${MobileContainer + 1}px)`]: {
    marginLeft: "-20px",
    "& .MuiPickerStaticWrapper-root": {
      marginLeft: "-1.2rem",
      "& > [class^=css-]": {
        marginLeft: "-.6rem",
      },
      "& > [class^=muirtl-]": {
        marginLeft: "-1rem",
      },
    },
  },
  "& .MuiPickerStaticWrapper-root": {
    marginTop: "-.8rem",
  },
  "& .MuiCalendarPicker-root": {
    maxHeight: "-webkit-fill-available",
    padding: "5px 0",
    '& [role="presentation"]': {
      fontWeight: 400,
    },
    "& > [class^=css-]": {
      backgroundColor: theme.palette.grey["A800"],
      margin: "0 10px",
      maxHeight: 60,
      minHeight: 54,
    },
    "& > [class^=muirtl-]": {
      backgroundColor: theme.palette.grey["A800"],
      margin: "0 10px",
      maxHeight: 60,
      minHeight: 54,
    },
    "& .MuiCalendarPicker-viewTransitionContainer": {
      overflow: "hidden",
    },
    "& .PrivatePickersYear-root": {
      flexBasis: "33.33%",
    },
    "& .MuiIconButton-sizeSmall": {
      overflow: "visible",
    },
  },
  "&.container-filter": {
    ".MuiPickerStaticWrapper-content": {
      minWidth: "auto",
      ".MuiCalendarOrClockPicker-root > div": {
        width: "auto",
        [`@media (max-width:${MobileContainer}px)`]: {
          width: "100%",
        },
      },
    },
    ".MuiPickerStaticWrapper-root": {
      marginLeft: "auto",
      ".MuiPickersDay-root": {
        width: 34,
        height: 34,
        [`@media (max-width:${MobileContainer}px)`]: {
          width: "100%",
          height:40,
        },
      },
      ".MuiDayPicker-weekDayLabel": {
        [`@media (max-width:${MobileContainer}px)`]: {
          width: "100%",
        },
      },
    },
    ".MuiDayPicker-weekContainer":{
        [`@media (max-width:${MobileContainer}px)`]: {
          gap:theme.spacing(2),
        }
      }
  },
}));

export default BoxStyled;
