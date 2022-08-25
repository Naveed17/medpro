import {Toolbar} from "@mui/material";
import {SubHeaderStyled} from "@features/subHeader";
import React from "react";

type LayoutProps = {
    children: React.ReactNode,
};

function SubHeader({children}: LayoutProps) {
    return (
        <SubHeaderStyled position="static" color="inherit" className="main-subheader">
            <Toolbar>
                {children}
            </Toolbar>
        </SubHeaderStyled>
    );
}

export default SubHeader;
