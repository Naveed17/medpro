import {Box} from "@mui/material";
import {styled} from "@mui/material/styles";

const RootStyled = styled(Box)(({theme}) => ({
    "& .popover-container": {
        "& .MuiTooltip-popper": {
            overflow: "initial",
            minWidth: 208,
            "& .MuiTooltip-tooltip": {
                backgroundColor: theme.palette.text.primary,
                "&.MuiTooltip-tooltipPlacementLeft": {
                    marginLeft: theme.spacing(1),
                },
                "&.MuiTooltip-tooltipPlacementRight": {
                    marginRight: theme.spacing(1),
                },
                "& .MuiTooltip-arrow": {
                    color: theme.palette.text.primary,
                },
            },
            "& .popover-item": {
                padding: theme.spacing(2),
                display: "flex",
                alignItems: "center",
                svg: {color: "#fff", marginRight: theme.spacing(1), fontSize: 20},
                cursor: "pointer",
            },
        },
    },
}));

export default RootStyled;
