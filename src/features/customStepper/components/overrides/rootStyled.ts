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
    padding: theme.spacing(0),
    "& .inner-section": {
      height: "calc(100vh - 110px)",
      overflow: "auto",
      padding: theme.spacing(3),
    },
    "& .action": {
      padding: theme.spacing(0, 3),
      marginTop: theme.spacing(1),
    },
  },
}));
export default RootStyled;
