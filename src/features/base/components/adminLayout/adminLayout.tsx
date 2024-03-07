import React from "react";
import {PageTransition, PageTransitionRef} from "@features/base";

import dynamic from "next/dynamic";

const SideBarMenu = dynamic(() => import("@features/menu/components/sideBarMenu/components/sideBarMenu"));

function AdminLayout({children}: LayoutProps, ref: PageTransitionRef) {
    return (
        <SideBarMenu>
            <PageTransition ref={ref}>
                {children}
            </PageTransition>
        </SideBarMenu>
    )
}

export default AdminLayout;
