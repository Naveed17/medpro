import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const RootStyled = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  paddingBottom: 5,
  position: "fixed",
  top: 0,
  zIndex: 111,
  "& .header": {
    backgroundColor: theme.palette.background.paper,
    paddingRight: "24px",
    borderBottom: `1px solid ${theme.palette.grey["A300"]}`,
    display: "flex",
    justifyContent: "flex-end",
    "& .MuiIconButton-root": {
      minHeight: "24px" + "!important",
      "& .refresh": {
        "& svg": {
          "& path": {
            fill: theme.palette.text.primary,
          },
        },
      },
    },
    "& .MuiButton-root": {
      minHeight: "24px",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  "& .patient-info": {
    borderBottom: `1px solid ${theme.palette.divider}`,
    "& .react-svg": {
      marginRight: "5px",
    },
  },
  "& .MuiTabs-root": {
    "& button": {
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(0.5, 1),
        minWidth: "auto",
        fontSize: theme.typography.body2.fontSize,
      },
      "&.Mui-disabled": {
        color: theme.palette.grey[200],
      },
    },
  },
}));

export default RootStyled;
