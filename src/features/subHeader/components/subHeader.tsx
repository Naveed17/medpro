import {alpha, Toolbar, useTheme} from "@mui/material";
import {SubHeaderStyled} from "@features/subHeader";
import React from "react";

function SubHeader({children, ...pageProps}: LayoutProps) {
    const theme = useTheme();
    return (
        <SubHeaderStyled sx={pageProps.sx} position="static" color="inherit" className="main-subheader">
            <Toolbar>
                {children}
            </Toolbar>
        </SubHeaderStyled>
    );
}

export default SubHeader;
