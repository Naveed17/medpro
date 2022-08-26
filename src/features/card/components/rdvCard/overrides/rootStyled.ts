import { styled } from "@mui/material/styles";
import { TableRow } from "@mui/material";
const RootStyled = styled(TableRow)(({ theme }) => ({
  "& .first-child": {
    borderStyle: "solid",
    borderRightWidth: 0,
    width: 200,
    color: "primary.main",
    svg: {
      width: "10px",
      height: 18,
      marginRight: theme.spacing(1),
      path: {
        fill: theme.palette.text.secondary,
      },
    },
    position: "relative",
    "&:after": {
      content: '" "',
      display: "block",
      position: "absolute",
      top: "0",
      right: 0,
      height: "100%",
      width: 4,
    },
  },
  "& .cell-motif": {
    color: "primary.main",
    display: "flex",
    svg: {
      width: "10px",
      height: 18,
      marginRight: theme.spacing(1),
      path: {
        fill: theme.palette.error.main,
      },
    },
  },
}));
export default RootStyled;
