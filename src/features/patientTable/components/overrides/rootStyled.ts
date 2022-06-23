import { styled } from "@mui/material/styles";

const RootStyled = styled("div")(({ theme }) => ({
  display: "none",
  "& .text-time": {
    display: "flex",
    alignItems: "center",
    svg: { marginRight: theme.spacing(0.5) },
  },
  "& .next-appointment": {
    display: "flex",
    alignItems: "center",
    svg: {
      width: 11,
      marginRight: theme.spacing(0.6),
      "& path": { fill: theme.palette.text.primary },
    },
  },
  [theme.breakpoints.up("md")]: {
    display: "block",
  },
}));

export default RootStyled;
