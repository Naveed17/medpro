import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { pxToRem } from "@themes/formatFontSize";

const RootStyled = styled(Stack)(({ theme }) => ({
  width: 248,
  "& .MuiChip-root": {
    height: pxToRem(29),
    width: pxToRem(56),
    "& .MuiChip-label": {
      paddingLeft: 9,
      paddingRight: 9,
      fontSize: theme.typography.body2.fontSize,
      fontWeight: 600,
    },
    borderRadius: pxToRem(4),
    color: theme.palette.text.secondary,
    boxShadow: "none",
    "&.Mui-disabled": {
      color: theme.palette.grey[300],
    },

    "&.active": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
    },
  },
  [theme.breakpoints.down("md")]: {
    margin: "0 auto",
  },
}));
export default RootStyled;
