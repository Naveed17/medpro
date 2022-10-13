import { styled, alpha } from "@mui/material/styles";
import { Box } from "@mui/material";
const RootStyled = styled(Box)(({ theme }) => ({
  padding: "10px",
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.palette.background.paper,
  marginTop: theme.spacing(9),
  flexDirection: "row",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
  borderBottom: `1px solid ${theme.palette.divider}`,
  "& .BaseBadge-badge": {
    bottom: 15,
    right: 9,
    height: 16,
    width: 16,
    borderRadius: "50%",
  },
  "& .react-svg": {
    marginRight: "5px",
  },
  "& .date-birth": {
    display: "flex",
    alignItems: "center",
    svg: { marginRight: theme.spacing(0.5) },
    [theme.breakpoints.down("md")]: {
      marginBottom: theme.spacing(1),
    },
  },
  "& .alert": {
    fontSize: "12px",
    padding: theme.spacing(0.8, 0.4),
    marginTop: theme.spacing(0.2),
    borderRadius: "6px",
    marginBottom: theme.spacing(0.9),
    textAlign: "left",
    justifyContent: "flex-start",
    color: theme.palette.text.secondary,
    display: "flex",
    alignItems: "center",
    backgroundColor: alpha(theme.palette.warning.main, 0.15),
    height: 22,
    "& svg": {
      width: 14,
      height: 14,
      path: {
        fill: theme.palette.warning.main,
      },
    },
  },
  "& .email-link": {
    marginTop: theme.spacing(1.5),
    alignItems: "center",
    display: "flex",
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(1),
    },
    svg: { height: 16, width: 16 },
  },
}));
export default RootStyled;
