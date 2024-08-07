import { Toolbar } from "@mui/material";
import { SubFooterStyled } from "@features/subFooter";
import React from "react";
import { useAppSelector } from "@lib/redux/hooks";
import { sideBarSelector } from "@features/menu";
type LayoutProps = {
    children: React.ReactNode,
    sx?: any,
};

function SubFooter({ children, ...rest }: LayoutProps) {
    const { opened } = useAppSelector(sideBarSelector);
    return (
        <SubFooterStyled {...rest} position="fixed" color="inherit" className={`${opened ? "opened-sidebar " : ""}`}>
            <Toolbar>
                {children}
            </Toolbar>
        </SubFooterStyled>
    );
}
export default SubFooter;
