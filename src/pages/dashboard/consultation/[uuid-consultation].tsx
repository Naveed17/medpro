import React, { useState } from 'react';
import { GetStaticProps, GetStaticPaths } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement } from "react";
import { Box, Stack, Grid } from "@mui/material";
import { DashLayout } from "@features/base";
import { SubHeader } from "@features/subHeader";
import { Otable } from '@features/table';
import { CIPPatientHistoryCard, CIPPatientHistoryCardData, ConsultationDetailCard } from "@features/card";
import { ModalConsultation } from '@features/modalConsultation';
import { ConsultationIPToolbar } from '@features/toolbar';
import { motion, AnimatePresence } from 'framer-motion';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;

}
interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
    align: "left" | "right" | "center";
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
// Patient data for table body
const PatiendData = [
    {
        id: 1,
        acts: "consultation",
        defaultAmount: 100,
        amount: 100,
    },
    {
        id: 2,
        acts: "consultation-1",
        defaultAmount: 200,
        amount: 200,
    }
];

// table head data
const headCells: readonly HeadCell[] = [
    {
        id: "select-all",
        numeric: false,
        disablePadding: true,
        label: "checkbox",
        sortable: false,
        align: "left",
    },
    {
        id: "acts",
        numeric: false,
        disablePadding: true,
        label: "acts",
        sortable: true,
        align: "left",
    },
    {
        id: "defaultAmount",
        numeric: true,
        disablePadding: false,
        label: "default_amount",
        sortable: true,
        align: "left",
    },
    {
        id: "amount",
        numeric: true,
        disablePadding: false,
        label: "amount",
        sortable: true,
        align: "left",
    },

];
function ConsultationInProgress() {
    const [value, setValue] = useState();
    const { t, ready } = useTranslation("consultation");
    if (!ready) return <>loading translations...</>;
    return (
        <>
            <SubHeader>
                <ConsultationIPToolbar selected={(v: number) => setValue(v)} />
            </SubHeader>
            <Box className="container">
                <AnimatePresence exitBeforeEnter>
                    {value === 0 &&
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
                    {value === 1 &&
                        <TabPanel index={1}>
                            fsadf
                        </TabPanel>
                    }
                    {value === 2 &&
                        <TabPanel index={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <ModalConsultation />
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <ConsultationDetailCard />
                                </Grid>
                            </Grid>
                        </TabPanel>
                    }
                    {
                        value === 3 &&
                        <TabPanel index={3}>
                            <Otable
                                headers={headCells}
                                rows={PatiendData}
                                state={null}
                                from={"CIP-medical-procedures"}
                                t={t}
                                edit={null}
                                handleConfig={null}
                                handleChange={null}

                            />
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
