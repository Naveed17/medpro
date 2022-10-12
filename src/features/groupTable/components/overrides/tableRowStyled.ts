import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";

const TableRowStyled = styled(TableRow)<any>(({ theme, styleprops }) => ({
  "& .MuiTableCell-root": {
    div: {
      color: "black",
    },
    "& .MuiSelect-select": {
      background: "white",
    },
    position: "relative",
    "& .name": {
      marginLeft: "24px",
      height: "100%",
      "&::after": {
        content: '" "',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        left: 24,
        width: "4px",
        height: "calc(100% - 16px)",
        background: styleprops ? theme.palette[styleprops].main : "",
      },
      "&::before": {
        content: '" "',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        left: 8,
        width: "13px",
        height: "13px",
        borderRadius: "50%",
        background: styleprops ? theme.palette[styleprops].main : "",
      },
    },
  },
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
}));
export default TableRowStyled;