import { Card, styled } from "@mui/material";
const CardStyled = styled(Card)(({ theme }) => ({
  ".MuiCardContent-root": {
    padding: theme.spacing(1),
  },
  ".btn-cash": {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 6,
    width: 30,
    height: 30,
    svg: {
      width: 16,
      height: 16,
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  ".MuiList-root": {
    marginTop: theme.spacing(1),
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(112px, 112px))",
    ".MuiListItem-root": {
      ".MuiListItemIcon-root": {
        minWidth: 0,
      },
      ".MuiListItemText-root": {
        margin: 0,
        paddingLeft: theme.spacing(0.5),
      },
      "&:not(:last-child)": {
        paddingRight: theme.spacing(1),
        "&:before": {
          content: '""',
          position: "absolute",
          right: 12,
          top: "50%",
          width: 1,
          height: "calc(100% - 10px)",
          transform: "translateY(-50%)",
          backgroundColor: theme.palette.text.primary,
          "@media (max-width: 370px)": {
            right: 6,
          },
        },
      },
    },
    "@media (max-width: 370px)": {
      gridTemplateColumns: "repeat(3, minmax(100px, 100px))",
    },
  },
}));

export default CardStyled;
