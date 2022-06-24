import { Toolbar } from "@mui/material";
import { useRouter } from "next/router";
import { SubHeaderStyled } from "@features/subHeader";
import React from "react";

type LayoutProps = {
    children: React.ReactNode,
};

function SubHeader({ children }: LayoutProps) {
    const router = useRouter();
    const path = router.asPath.split("/");
    return (
        <SubHeaderStyled position="static" color="inherit" className="main-subheader">
            <Toolbar>
                {children}
            </Toolbar>
        </SubHeaderStyled>
    );
}
export default SubHeader;
