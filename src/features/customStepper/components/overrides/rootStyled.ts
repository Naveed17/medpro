import { styled } from "@mui/material/styles";

const RootStyled = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: "inherit",
  "& .stepper-tabs": {
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(0, 0.5),
    "& .MuiTabs-flexContainer": {
      justifyContent: "space-around",
    },
    button: {
      borderBottom: `2px solid ${theme.palette.grey[200]}`,

      borderRadius: 0,
      transition: "all 0.3s ease-in-out",
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(0.5, 1),
        minWidth: "auto",
        fontSize: theme.typography.body2.fontSize,
      },
      "&.Mui-disabled": {
        borderBottomWidth: 1,
      },
      "&.Mui-selected": {
        color: theme.palette.primary.main,
        borderBottom: "2px solid transparent",
      },
    },
    "& .submitted": {
      borderBottom: "2px solid " + theme.palette.text.primary,
    },
    "& .pending": {
      borderBottom: "2px solid " + theme.palette.text.secondary,
      opacity: 0.4,
    },
  },
  '& div[role="tabpanel"]': {
    overflow: "auto",
  },
  "& div[role='tabpanel'] > div": {
    "& .inner-section": {
      height: "calc(100vh - 160px)",
      overflow: "auto",
      padding: theme.spacing(3),
      "& .inner-box": {
        marginTop: 12,
      },

      "&.type-time-slot": {
        padding: 0,
        ".MuiFormControl-root": {
          padding: 0,
        },
        ".MuiFormControlLabel-root": {
          margin: 0,
        },
        ".MuiFormGroup-root": {
          padding: theme.spacing(2),
        },
      },
    },
    "& .action": {
      padding: theme.spacing(1, 3),
      marginTop: theme.spacing(3),
      position: "absolute",
      width: "100%",
      left: 0,
    },
    [theme.breakpoints.down("md")]: {
      padding: 0,
      paddingTop: theme.spacing(3),
    },
  },
}));
export default RootStyled;
