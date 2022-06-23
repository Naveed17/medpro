import dynamic from "next/dynamic";
import React from "react";
import { useRouter } from "next/router";
const SideBarMenu = dynamic(() => import('@features/sideBarMenu/components/sideBarMenu'));
import { motion } from 'framer-motion';

const variants = {
    hidden: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 },
}

function DashLayout({ children }: LayoutProps) {
    const router = useRouter();
    return (
        <SideBarMenu>
            <motion.main
                key={router.route}
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={variants}
                transition={{ type: 'linear' }}>
                {children}
            </motion.main>
        </SideBarMenu>
    )
}

export default DashLayout;
