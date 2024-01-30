import { styled, Card } from "@mui/material";
const ActFeesCardStyled = styled(Card)(({ theme }) => ({
  ".MuiCardContent-root": {
    padding: theme.spacing(2, 1) + "!important",
    ".MuiOutlinedInput-root input": {
      paddingLeft: theme.spacing(1),
      paddingRight: 0,
    },
    ".actions": {
      "&.actions": {
        marginLeft: "auto",
        ".btn-more": {
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 6,
        },
        ".MuiBadge-badge": {
          fontSize: 9,
        },
      },
    },
  },
}));
export default ActFeesCardStyled;
