import { styled } from "@mui/material/styles";
import { Stack } from "@mui/material";
const CIPPatientHistoryCardStyled = styled(Stack)(({ theme }) => ({
  ".time-line": {
    position: "relative",
    minWidth: 32,
    ".expand-btn": {
      backgroundColor: theme.palette.primary.light,
      padding: theme.spacing(0.5),
      svg: {
        width: 16,
        height: 16,
      },
    },
    "&:before": {
      content: "''",
      position: "absolute",
      width: 8,
      borderTop: `1px dashed ${theme.palette.text.primary}`,
      right: 0,
      top: 12,
    },
    "&:after": {
      content: "''",
      position: "absolute",
      width: 1,
      height: "calc(100% - 16px)",
      borderRight: `1px dashed ${theme.palette.text.primary}`,
      bottom: -8,
      left: 11,
    },
  },
  ".MuiCard-root": {
    width: "100%"
  },
  ".MuiStack-root": {
    margin: 0
  },
  "&:last-of-type": {
    ".time-line": {
      "&:after": {
        display: "none",
      },
    },
  },
}));
export default CIPPatientHistoryCardStyled;
