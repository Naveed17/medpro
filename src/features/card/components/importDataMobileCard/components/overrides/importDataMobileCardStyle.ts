import { styled, Card } from "@mui/material";
const ImportDataMobileCardStyled = styled(Card)(({ theme }) => ({
  ".MuiCardContent-root": {
    paddingBottom: "16px !important",
    padding: theme.spacing(2),
    ".MuiChip-root": {
      height: theme.spacing(3),
      ".MuiChip-label": {
        fontSize: theme.typography.body2.fontSize,
      },
    },
    ".date-sec": {
      svg: {
        width: 12,
        height: 12,
        path: {
          fill: theme.palette.text.primary,
        },
      },
    },
  },
}));
export default ImportDataMobileCardStyled;
