import React, { useState } from 'react';
import { GetStaticProps, GetStaticPaths } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement } from "react";
import { Box, Stack } from "@mui/material";
import { DashLayout } from "@features/base";
import { SubHeader } from "@features/subHeader";
import { CIPPatientHistoryCard, CIPPatientHistoryCardData } from "@features/card";
import { ConsultationIPToolbar } from '@features/toolbar';
import { motion, AnimatePresence } from 'framer-motion';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;

}
const variants = {
    initial: { opacity: 0, },
    animate: {
        opacity: 1,
        transition: {
            delay: 0.5
        }
    }
};
function TabPanel(props: TabPanelProps) {
    const { children, index, ...other } = props;

    return (
        <motion.div
            key={index}
            variants={variants}
            initial="initial"
            animate={"animate"}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {children}
        </motion.div>
    );
}

function ConsultationInProgress() {
    const [value, setValue] = useState();
    const { t, ready } = useTranslation("consultation");
    if (!ready) return <>loading translations...</>;
    return (
        <>
            <SubHeader>
                <ConsultationIPToolbar selected={(v: string) => setValue(v)} />
            </SubHeader>
            <Box className="container">
                <AnimatePresence exitBeforeEnter>
                    {value === "patient history" &&
                        <TabPanel index={0}>
                            <Stack spacing={2}>
                                {
                                    CIPPatientHistoryCardData.map((data, index: number) => (
                                        <React.Fragment key={index}>
                                            <CIPPatientHistoryCard data={data} />
                                        </React.Fragment>
                                    ))}
                            </Stack>
                        </TabPanel>
                    }
                    {value === "mediktor report" &&
                        <TabPanel index={1}>
                            fsadf
                        </TabPanel>
                    }
                </AnimatePresence>
            </Box>
        </>
    );
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ["consultation", "menu", "common"])),
    },
});
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}
export default ConsultationInProgress;

ConsultationInProgress.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
