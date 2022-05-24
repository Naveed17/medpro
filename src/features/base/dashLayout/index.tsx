import dynamic from "next/dynamic";
import React from "react";
const SideBarMenu = dynamic(() => import('@features/sideBarMenu/components/sideBarMenu'))

type LayoutProps = {
    children: React.ReactNode,
};

export default function DashLayout({ children }: LayoutProps) {

    return (
        <SideBarMenu>
            {children}
        </SideBarMenu>
    )
}
