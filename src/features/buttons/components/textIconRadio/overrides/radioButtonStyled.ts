import {styled} from "@mui/material/styles";
import {Button} from "@mui/material";

const RadioButtonStyled = styled(Button)(({theme, ...props}: any) => {
    const {disabled, selectedvalue, uuid} = props;

    return ({
        pl: "8.5px",
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
                "& .MuiBox-root": {
                    display: "contents"
                },
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
                    background: theme.palette.info.main,
                    height: "54px",
                    boxShadow: "none",
                    color: theme.palette.common.white,
                    border: `1px solid ${theme.palette.grey["A200"]}`,
                },
            }),
        ...(selectedvalue === uuid && {
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
