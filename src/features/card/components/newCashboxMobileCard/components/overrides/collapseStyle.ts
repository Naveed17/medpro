import { styled, Collapse } from "@mui/material";
const CollapseStyled = styled(Collapse)(({ theme }) => ({
  ".collapse-wrapper": {
    position: "relative",
    ".means-wrapper": {
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.default,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderTop: "none",
    },
    ".consultation-card": {
      ".MuiCardContent-root": {
        "&:last-child": {
          padding: theme.spacing(2),
        },
      },
      "&:not(:last-child)": {
        marginBottom: theme.spacing(1),
      }
    },
  },
}));
export default CollapseStyled;