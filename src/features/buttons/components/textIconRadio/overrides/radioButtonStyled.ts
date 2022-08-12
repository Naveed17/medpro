import {styled} from "@mui/material/styles";
import {Button} from "@mui/material";

const RadioButtonStyled = styled(Button)(({theme, ...props}: any) => {
    const {disabled, selectedvalue, title} = props;

    return ({
        pl: "8.5px",
        "& .MuiSvgIcon-root": {
            width: "24px"
        },
        ...(!disabled
            ? {
                background: theme.palette.background.paper,
                "& .text-inner path": {
                    fill: theme.palette.text.primary,
                },
                justifyContent: "flex-start",
                width: "100%",
                height: "54px",
                border: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.primary,
                textTransform: "inherit",
                "& .MuiButton-startIcon": {
                    path: {
                        fill: theme.palette.common.white,
                    },
                },
                "&:hover ": {
                    background: theme.palette.grey["A700"],
                    boxShadow: "none",
                    "& .text-inner path": {
                        fill: theme.palette.primary.main,
                    },
                },
                "&:focus, &:focus": {
                    background: theme.palette.primary.main,
                    color: theme.palette.background.paper,
                    "& svg path, & .text-inner path": {
                        fill: theme.palette.background.paper,
                    },
                },
            }
            : {
                "&.Mui-disabled": {
                    justifyContent: "flex-start",
                    width: "100%",
                    background: "#F1F1F1",
                    height: "54px",
                    boxShadow: "none",
                    color: theme.palette.common.white,
                    border: "1px solid #DDDDDD",
                },
            }),
        ...(selectedvalue === title && {
            background: theme.palette.primary.main,
            color: theme.palette.background.paper,
            "& svg path, & .text-inner path, & .MuiSvgIcon-root path": {
                fill: theme.palette.background.paper,
            },
            "&:hover ": {
                background: theme.palette.grey["A700"],
                boxShadow: "none",
                color: theme.palette.primary.main,
                "& svg path": {
                    fill: theme.palette.primary.main
                }
            }
        }),
    })
});
export default RadioButtonStyled;
