import { styled } from "@mui/material/styles";
import Box, { BoxProps } from "@mui/material/Box";
interface Props extends BoxProps {
  isChecked?: boolean;
}
const RootStyled = styled(Box)<Props>(({ theme, isChecked }) => ({
  margin:'auto',
  height: "inherit",
  ".MuiStepLabel-iconContainer": {
    position: "relative",
    zIndex: 99,
  },
  ".MuiStepper-root": {
    justifyContent: "center",
    ".MuiStepConnector-root": {
      zIndex: 0,
      left: "calc(-50% + 12px)",
      right: "calc(50% + 12px)",
      [theme.breakpoints.down("sm")]: {
        left: "calc(-50% + 0px)",
        right: "calc(50% + 0px)",
      },
    },
    ".MuiStepIcon-text": {
      display: "none",
    },
    ".MuiSvgIcon-root": {
      color: theme.palette.divider,
    },
  },
  ".MuiStep-root": {
    position: "relative",
    "&.active": {
      ".MuiSvgIcon-root": {
        color: theme.palette.primary.main,
      },
      ".MuiStepLabel-iconContainer": {
        position: "relative",
        zIndex: 999,
        "&::before": {
          content: "''",
          position: "absolute",
          width: theme.spacing(2),
          height: theme.spacing(2),
          background: theme.palette.warning.main,
          borderRadius: "50%",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 9999,
        },
      },
      "&::after": {
        content: "''",
        position: "absolute",
        width: "50%",
        height: 2,
        background: theme.palette.warning.main,
        zIndex: 9999,
        left: "50%",
        top: 11.5,
      },
    },
      "&.last-step": {
        "& .MuiSvgIcon-root": {
          color: theme.palette.primary.main,
        },
        ".MuiStepLabel-iconContainer": {
          position: "relative",
          zIndex: 999,
          "&::before": {
            content: "''",
            position: "absolute",
            width: theme.spacing(2),
            height: theme.spacing(2),
            background: theme.palette.warning.main,
            borderRadius: "50%",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            zIndex: 9999,
          },
        },
        "&::after": {
          content: "''",
          position: "absolute",
          width: "50%",
          height: 2,
          background: theme.palette.warning.main,
          zIndex: 9999,
          left: "0",
          top: 11.5,
        },
      },
    
  },
  ".MuiStepLabel-label":{
    "&.Mui-active":{
      color:theme.palette.primary.main,
    },
    "&.Mui-disabled":{
      color:theme.palette.text.primary
    }
  },
  ".Mui-completed": {
    ".MuiSvgIcon-root": {
      color: theme.palette.primary.main,
    },
    ".MuiStepLabel-iconContainer": {
      "&::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      },
    },
  },
}));
export default RootStyled;
