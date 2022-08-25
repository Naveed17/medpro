import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const RootStyled = styled(Box)(({ theme }) => ({
  "& .popover-container": {
    "& .MuiTooltip-popper": {
      overflow: "initial",
      minWidth: 208,
      "& .MuiTooltip-tooltip": {
        backgroundColor: "#1B2746",

        "&.MuiTooltip-tooltipPlacementLeft": {
          marginLeft: theme.spacing(1),
        },
        "&.MuiTooltip-tooltipPlacementRight": {
          marginRight: theme.spacing(1),
        },
        "& .MuiTooltip-arrow": {
          color: "#1B2746",
        },
      },
      "& .popover-item": {
        padding: theme.spacing(2),
        display: "flex",
        alignItems: "center",
        svg: { color: "#fff", marginRight: theme.spacing(1), fontSize: 20 },
        cursor: "pointer",
      },
    },
  },
}));

export default RootStyled;
