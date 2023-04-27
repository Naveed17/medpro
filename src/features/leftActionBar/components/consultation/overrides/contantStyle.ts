import { styled } from "@mui/material/styles";
import { Card } from "@mui/material";
const ContentStyled = styled(Card)(({ theme }) => ({
  marginBottom: theme.typography.pxToRem(10),
  ".MuiCardContent-root": {
    padding: theme.spacing(1),
    ".MuiList-root": {
      padding: 0,
      paddingLeft: theme.spacing(2),
      width: "100%",
      ".MuiListItem-root": {
        paddingLeft: 0,
        paddingRight: 0,

        ".MuiListItemIcon-root": {
          minWidth: 10,
          svg: {
            width: theme.typography.pxToRem(5),
            height: theme.typography.pxToRem(5),
            fill: theme.palette.text.secondary,
          },
        },
      },
    },
    ".MuiButton-root": {
      ".MuiButton-startIcon": {
        marginRight: theme.spacing(0.5),
      },
    },
    ".title": {
      fontWeight:600,
      "&::first-letter": {
        textTransform: "capitalize"
      }
    }
  },
}));
export default ContentStyled;
