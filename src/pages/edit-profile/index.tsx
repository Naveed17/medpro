import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useState } from "react";
import { Box, Button, Container, Paper, Toolbar, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { TopNavBar } from "@features/topNavBar";
import { MainMenuStyled } from "@features/menu";
import { CheckProfileStatus } from "@features/checkProfileStatus";
import { LoadingScreen } from "@features/loadingScreen";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { Info, Document, Actes, Cabinet, stepperProfileSelector } from "@features/tabPanel";
import { useAppSelector } from "@lib/redux/hooks";
import { CustomStepper } from "@features/customStepper";

const stepperData = [
    {
        title: "tabs.tab-1",
        children: Info
    },
    {
        title: "tabs.tab-2",
        children: Document
    },
    {
        title: "tabs.tab-3",
        children: Actes
    },
    {
        title: "tabs.tab-4",
        children: Cabinet
    },
];

function EditProfile() {
    const { data: session, status } = useSession();
    const { currentStepper: stepperIndex } = useAppSelector(stepperProfileSelector);
    const router = useRouter();
    const loading = status === 'loading';
    const { step } = router.query;
    const [currentStepper, setCurrentStepper] = useState(step ? (parseInt(step as string, 0) - 1) : stepperIndex);
    const { t, ready } = useTranslation('editProfile', { keyPrefix: 'steppers' });
    // get user session data
    const { data: user } = session as Session;

    if (!ready || loading) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <Box className="container">

            <Container fixed>
                <Paper sx={{ mt: 4, borderRadius: "10px", mb: 4 }}>
                    {currentStepper > 3 ? (
                        <CheckProfileStatus doctor={user} />
                    ) : (
                        <>
                            <Typography
                                variant="h6"
                                p={2}
                                sx={{
                                    bgcolor: "primary.main",
                                    color: "common.white",
                                    borderRadius: "10px 10px 0 0",
                                }}
                            >
                                {t(`stepper-${currentStepper}.title`)}
                            </Typography>
                            <Container maxWidth="md">
                                <Box sx={{ width: "100%", py: 3 }}>
                                    <Box sx={{ maxWidth: { xs: 555, sm: "100%" } }}>
                                        <CustomStepper
                                            currentIndex={currentStepper}
                                            translationKey="editProfile"
                                            t={t}
                                            prefixKey="steppers"
                                            stepperData={stepperData} />
                                    </Box>
                                </Box>
                            </Container>
                            <Box
                                component="footer"
                                sx={{
                                    textAlign: "right",
                                    boxShadow: theme => theme.customShadows.customShadow1,
                                    p: 1.5,
                                }}
                            >
                                {currentStepper !== 0 && (
                                    <Button
                                        onClick={() => setCurrentStepper(currentStepper - 1)}
                                        variant="text"
                                        sx={{ color: "text.secondary", mr: 2 }}
                                    >
                                        {t(`back`)}
                                    </Button>
                                )}

                                <Button
                                    onClick={() => setCurrentStepper(currentStepper + 1)}
                                    variant="contained"
                                    color="primary"
                                >
                                    {t(`next`)}
                                </Button>
                            </Box>
                        </>
                    )}
                </Paper>
            </Container>
        </Box>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(locale as string, ['common', 'menu', 'editProfile']))
        }
    }
}

export default EditProfile;

EditProfile.auth = true;

EditProfile.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainMenuStyled className="header-main">
            <TopNavBar />
            <Box className="body-main">
                <Toolbar />
                <Box component="main">
                    {page}
                </Box>
            </Box>
        </MainMenuStyled>
    )
}
