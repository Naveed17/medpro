import PropTypes from "prop-types";
// material
import RootStyled from "./overrides/labelStyled";

// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

export default function Label({
    color = "default",
    variant = "ghost",
    children,
    ...other
}) {
    return (
        <RootStyled styleprops={{ color, variant }} {...other}>
            {children}
        </RootStyled>
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
