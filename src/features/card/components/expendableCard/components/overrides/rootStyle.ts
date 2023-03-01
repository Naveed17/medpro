import { Card, styled, CardProps } from "@mui/material";
interface Props extends CardProps {
  component?: any;
  layout?: any;
}
const RootStyled = styled(Card)<Props>(({ theme }) => ({
  width: '100%',
  position: "relative",
  ".MuiCardContent-root": {
    padding: theme.spacing(1),
    ".MuiInputBase-input": {
      fontSize: 12,
    },
  },
  ".view_more": {
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "flex-end",
    height: 75,
    position: "absolute",
    width: "100%",
    bottom: 0,
    background:
      "linear-gradient(0deg, #fff 41.55%, rgba(255, 255, 255, 0) 65.16%)",
  },
  ".MuiCardActions-root": {
    borderTop: `1px solid ${theme.palette.divider}`,
    position: "relative",
    justifyContent: "center",
    ".btn-action": {
      position: "absolute",
      padding: theme.spacing(1),
      transition: theme.transitions.create("all"),
      minWidth: "auto",
      width: 40,
      ".MuiTypography-root": {
        display: "none",
      },
      "&:hover": {
        width: "120px",
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        ".MuiTypography-root": {
          display: "block",
        },
        "&.btn-del": {
          backgroundColor: theme.palette.error.main,
          svg: {
            path: {
              fill: theme.palette.common.white,
            },
          },
        },
      },
      svg: {
        width: 20,
        height: 20,
      },
      "&.btn-del": {
        left: 8,
      },
      "&.btn-save": {
        right: 8,
      },
    },
  },
}));
export default RootStyled;
