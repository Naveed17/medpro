// material
import RootStyled from "./overrides/labelStyled";
import React from "react";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";

type LabelProps = {
    children: React.ReactNode,
    color: string,
    variant: string,
    sx?: SxProps<Theme>,
};

function Label({
    color = "default",
    variant = "ghost",
    children,
    ...other
} : LabelProps) {
    return (
        <RootStyled color={color} variant={variant} {...other}>
            {children}
        </RootStyled>
    );
}
export default Label;

