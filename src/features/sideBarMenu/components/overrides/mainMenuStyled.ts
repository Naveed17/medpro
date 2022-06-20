import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const MainMenuStyled = styled(Box)(({ theme }) => ({
  display: "flex",
  "& .body-main": {
    flexGrow: 1,
    overflow: "hidden",
  },
  "& .sidenav-main": {
    width: 84,
    flexShrink: 0,
    "& .MuiDrawer-root": {
      display: "block",
      "& .MuiDrawer-paper": {
        boxSizing: "border-box",
        width: 84,
      },
    },
    "& .nav-logo": {
      margin: "0 auto",
      display: "table",
      marginTop: 4,
    },
    "& .MuiList-root": {
      "&.list-bottom": {
        position: "absolute",
        bottom: 0,
        left: 22,
        "& .mt-2": {
          marginTop: 6,
        },
      },
      "& .MuiListItem-root": {
        flexDirection: "column",
        "&:hover": {
          backgroundColor: "transparent",
          "& .MuiListItemIcon-root": {
            backgroundColor: theme.palette.info.main,
            boxShadow: theme.shadows[4],
            border: "1px solid #E3EAEF",
          },
        },
        "&.active": {
          "& .MuiListItemIcon-root": {
            backgroundColor: theme.palette.primary.main,
            "& svg": {
              "& path": {
                fill: theme.palette.grey[50],
                transition: "all ease-in 0.2s",
              },
            },
          },
        },
        "& .MuiListItemIcon-root": {
          borderRadius: 10,
          border: "1px solid transparent",
          transition: "all ease-in 0.2s",
          padding: 7,
          "& svg": {
            width: 22,
          },
        },
        "& .MuiListItemText-root": {
          "& span": {
            fontSize: 12,
          },
        },
      },

      "@media screen and (max-height: 600px)": {
        marginTop: 0,
        "&.list-bottom": {
          paddingTop: 0,
          position: "relative",
          bottom: 0,
          left: 0,
        },
      },
      "@media screen and (min-height: 750px)": {
        marginTop: 20,
        " &.list-bottom": {
          position: "absolute",
          bottom: 0,
          left: 22,
        },
        "& .action-bar-open": {
          padding: "10px 0px 10px 20px",
          backgroundColor: theme.palette.background.paper,
          overflowY: "auto",
          overflowX: "hidden",
          height: "100%",
          zIndex: 1200,
          position: "fixed",
          top: 0,
          outline: 0,
          left: 84,
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: "all ease-in-out 0.5s",
          width: 284,
        },
      },
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  "& .action-side-nav": {
    width: 0,
    flexShrink: 0,
    overflow: "hidden",
    opacity: 0,
    visibility: "hidden",
    zIndex: -999,
    transition: "all ease-in-out 0.5s",

    "&.active": {
      width: 284,
      opacity: 1,
      backgroundColor: theme.palette.background.paper,
      zIndex: 100,
      visibility: "visible",
    },
    "& .action-bar-open": {
      padding: "10px 0px 10px 20px",
      backgroundColor: theme.palette.background.paper,
      overflowY: "auto",
      height: "100%",
      zIndex: 1200,
      position: "fixed",
      top: 0,
      outline: 0,
      left: 84,
      borderRight: `1px solid ${theme.palette.divider}`,
      transition: "all ease-in-out 0.5s",
      width: 284,
    },
  },
}));

export default MainMenuStyled;
