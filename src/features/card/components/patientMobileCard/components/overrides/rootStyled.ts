import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const RootStyled = styled(Box)(({ theme }) => ({
  display: "none",
  width: "100%",
  "& .card-main": { padding: "10px", marginBottom: "0.5rem" },
  "& .heading": {
    display: "flex",
    lineHeight: "21px",
    alignItems: "center",
    svg: {
      marginRight: theme.spacing(0.5),
    },
  },
  "& .border-left-sec": {
    marginTop: theme.spacing(1),
    display: "flex",
    ".btn-phone": {
      marginLeft: "auto",
      backgroundColor: theme.palette.primary.lighter,
      border: `1px solid ${theme.palette.success.main}`,
      padding: theme.spacing(0.7),
      borderRadius: 4,
      svg: {
        width: 18,
        height: 18,
        path: {
          fill: theme.palette.success.main,
        },
      },
    },
  },
  "& .phone-call": {
    textDecoration: "auto",
    color: "white",
  },
  "& .date-time-text": {
    display: "flex",
    marginTop: theme.spacing(0.2),
    alignItems: "center",
    svg: {
      width: 11,
      margin: theme.spacing(0, 0.5),
      path: { fill: theme.palette.text.primary },
    },
  },
  "& .filter-btn": {
    position: "fixed",
    bottom: 10,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1,
  },
  [theme.breakpoints.down("md")]: {
    display: "block",
  },
}));

export default RootStyled;
