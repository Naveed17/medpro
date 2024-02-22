import { GetStaticProps, GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useState } from "react";
import { SubHeader } from "@features/subHeader";
import { useTranslation } from "next-i18next";
import { Stack, Box, useTheme, MenuItem, Typography, } from "@mui/material";
import { useRouter } from "next/router";
import { DashLayout } from "@features/base";
import { LoadingScreen } from "@features/loadingScreen";
import { DoctorToolbar } from "@features/toolbar";
import { DoctorAboutTab } from "@features/tabPanel";
import { Dialog } from "@features/dialog";
import { ActionMenu } from "@features/menu";
import IconUrl from "@themes/urlIcon";

function DoctorDetails() {
    const router = useRouter();
    const theme = useTheme();
    const [open, setOpen] = useState<boolean>(false)
    const { t, ready } = useTranslation("doctors", { keyPrefix: "config" });
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const handleCloseMenu = () => {
        setContextMenu(null);
    }
    const popoverActions = [
        {
            title: "demoData",
            icon: <IconUrl color={"white"} path="/ic-voir" />,
            action: "onDemoAction",
        },

    ];
    const OnMenuActions = (action: string) => {
        handleCloseMenu();

    }
    const handleOpenMeun = (event: any) => setContextMenu(
        contextMenu === null
            ? {
                mouseX: event.clientX + 2,
                mouseY: event.clientY - 6,
            } : null,
    );
    const error = false
    const handleClose = () => {
        setOpen(false);
    }
    if (!ready || error) {
        return <LoadingScreen
            button
            {...(error ? {
                OnClick: () => router.push('/dashboard/admin/doctors'),
                text: 'loading-error-404-reset'
            } : {})}
        />
    }
    return (
        <>
            <SubHeader
                sx={{
                    ".MuiToolbar-root": {
                        py: { md: 0, xs: 2 },
                    },
                }}>
                <DoctorToolbar {...{ t, title: "sub-header.doctor_title" }} />
            </SubHeader>

            <Box className="container">
                <Stack spacing={2}>
                    <DoctorAboutTab {...{ t, theme, handleOpenMeun, handleOpenRestPass: () => setOpen(true) }} />
                </Stack>
            </Box>
            <Dialog
                action="rest-password"
                title={t("dialog.title")}
                sx={{ p: 0 }}
                open={open}
                data={{ t, theme, handleClose }}
                onClose={handleClose}
                dialogClose={handleClose}
            />
            <ActionMenu {...{ contextMenu, handleClose: handleCloseMenu }}>
                {popoverActions.map(
                    (v: any, index) => (
                        <MenuItem
                            key={index}
                            className="popover-item"
                            onClick={() => {
                                OnMenuActions(v.action);
                            }}>
                            {v.icon}
                            <Typography fontSize={15} sx={{ color: "#fff" }}>
                                {t(`popover-action.${v.title}`)}
                            </Typography>
                        </MenuItem>
                    )
                )}
            </ActionMenu>
        </>
    );
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'doctors']))
    }
})


export default DoctorDetails;

DoctorDetails.auth = true;

DoctorDetails.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
