import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const RootStyled = styled(Box)(({ theme }) => ({
  display: "none",
  width: "100%",
  "& .card-main": {
    padding: "16px", 
    marginBottom: "0.5rem",
    borderRadius:theme.spacing(2),
    border:'none',
    boxShadow: "0px 2px 4px 0px #0000001A",

   },
  "& .heading": {
    display: "flex",
    lineHeight: "21px",
    alignItems: "center",
    color:theme.palette.primary.main,
    svg: {
      marginRight: theme.spacing(0.5),
    },
  },
   ".btn-phone": {
      marginLeft: "auto",
      backgroundColor: theme.palette.success.light,
      border: `1px solid ${theme.palette.success.light}`,
      padding: theme.spacing(0.7),
      borderRadius: 8,
      minWidth:40,
      minHeight:40
    },
  "& .border-left-sec": {
    marginTop: theme.spacing(1),
   
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
