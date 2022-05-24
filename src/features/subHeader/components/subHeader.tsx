import {Breadcrumbs, Hidden, Toolbar, Typography} from "@mui/material";
import {useRouter} from "next/router";
import {SubHeaderStyled} from "@features/subHeader";
import Link from "@themes/Link";
import React from "react";

type LayoutProps = {
    children: React.ReactNode,
};

function SubHeader({ children }: LayoutProps){
    const router = useRouter();
    const path = router.asPath.split("/");
    const breadcrumb = path.filter(Boolean);
    return(
        <SubHeaderStyled position="static" color="inherit" className="main-subheader">
            <Toolbar>
                {children}
            </Toolbar>
        </SubHeaderStyled>
    );
}
export default  SubHeader;
