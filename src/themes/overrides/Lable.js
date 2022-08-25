import PropTypes from "prop-types";
// material
import { alpha, experimentalStyled as styled } from "@mui/material/styles";

// ----------------------------------------------------------------------

const RootStyle = styled("span")(({ theme, styleprops }) => {
    const isLight = theme.palette.mode === "light";
    const { color, variant } = styleprops;

    const styleFilled = (color) => ({
        color: theme.palette[color].contrastText,
        backgroundColor: theme.palette[color].main,
    });

    const styleOutlined = (color) => ({
        color: theme.palette[color].main,
        backgroundColor: "transparent",
        border: `1px solid ${theme.palette[color].main}`,
    });

    const styleGhost = (color) => ({
        color: theme.palette[color][isLight ? "dark" : "light"],
        backgroundColor: alpha(theme.palette[color].main, 0.16),
    });

    return {
        height: 23,
        minWidth: 22,
        lineHeight: 1,
        borderRadius: theme.typography.pxToRem(30),
        cursor: "default",
        alignItems: "center",
        whiteSpace: "nowrap",
        display: "inline-flex",
        justifyContent: "center",
        padding: theme.spacing(0, 1),
        color: theme.palette.grey[800],
        fontSize: theme.typography.pxToRem(11),
        fontFamily: "Poppins",
        backgroundColor: theme.palette.grey[300],
        ...(color !== "default"
            ? {
                ...(variant === "filled" && { ...styleFilled(color) }),
                ...(variant === "outlined" && { ...styleOutlined(color) }),
                ...(variant === "ghost" && { ...styleGhost(color) }),
            }
            : {
                ...(variant === "outlined" && {
                    backgroundColor: "transparent",
                    color: theme.palette.text.primary,
                    border: `1px solid ${theme.palette.grey[500_32]}`,
                }),
                ...(variant === "ghost" && {
                    color: isLight
                        ? theme.palette.text.secondary
                        : theme.palette.common.white,
                    backgroundColor: theme.palette.grey[500_16],
                }),
            }),
    };
});

// ----------------------------------------------------------------------

export default function Label({
                                  color = "default",
                                  variant = "ghost",
                                  children,
                                  ...other
                              }) {
    return (
        <RootStyle styleprops={{ color, variant }} {...other}>
            {children}
        </RootStyle>
    );
}

Label.propTypes = {
    children: PropTypes.node,
    color: PropTypes.oneOf([
        "default",
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
    ]),
    variant: PropTypes.oneOf(["filled", "outlined", "ghost"]),
};
