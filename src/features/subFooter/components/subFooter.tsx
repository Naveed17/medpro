import { Toolbar } from "@mui/material";
import { SubHeaderStyled } from "@features/subHeader";
import React from "react";

type LayoutProps = {
    children: React.ReactNode,
    sx?: any,
};

function SubFooter({ children, ...rest }: LayoutProps) {
    return (
        <SubHeaderStyled {...rest} position="static" color="inherit">
            <Toolbar>
                {children}
            </Toolbar>
        </SubHeaderStyled>
    );
}
export default SubFooter;
