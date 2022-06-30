import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import {Box, Button, Container, Paper, Toolbar, Typography} from "@mui/material";
import {useSession} from "next-auth/react";
import {TopNavBar} from "@features/topNavBar";
import {MainMenuStyled} from "@features/sideBarMenu";
import {CheckProfileStatus} from "@features/checkProfileStatus";
import {LoadingScreen} from "@features/loadingScreen";
import {Session} from "next-auth";
import {Steppers} from "@features/steppers";
import {useRouter} from "next/router";
import useRequest from "@app/axios/axiosServiceApi";

function EditProfile() {
    const {data: session, status} = useSession();
    const router = useRouter();
    const loading = status === 'loading';
    const {step} = router.query;
    const [currentStepper, setCurrentStepper] = useState(parseInt(step as string,0) - 1);
    const {t, ready} = useTranslation('editProfile', {keyPrefix: 'steppers'});

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const { data: httpResponse, error } = useRequest({
        method: "GET",
        url: `/api/medical/entity/profile/${medical_entity.uuid}/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    if (!ready || loading || !httpResponse) return (<LoadingScreen/>);

    console.log('httpResponse', httpResponse);

    return (
        <Box bgcolor="#F0FAFF"
             sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>

            <Container fixed>
                <Paper sx={{mt: 4, borderRadius: "10px", mb: 4}}>
                    {currentStepper > 3 ? (
                        <CheckProfileStatus doctor={user}/>
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
                                <Steppers currentStepper={currentStepper}/>
                            </Container>
                            <Box
                                component="footer"
                                sx={{
                                    textAlign: "right",
                                    boxShadow: " 0px -1px 1px rgba(0, 150, 214, 0.45)",
                                    p: 1.5,
                                }}
                            >
                                {currentStepper !== 0 && (
                                    <Button
                                        onClick={() => setCurrentStepper(currentStepper - 1)}
                                        variant="text"
                                        sx={{color: "#1B2746", mr: 2}}
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

export const getStaticProps: GetStaticProps = async ({locale}) => {
    return {
        props: {
            ...(await serverSideTranslations(locale as string, ['common', 'menu', 'editProfile']))
        }
    }
}

export default EditProfile;

EditProfile.auth = true;

EditProfile.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainMenuStyled className="header-main">
            <TopNavBar/>
            <Box className="body-main">
                <Toolbar/>
                <Box component="main">
                    {page}
                </Box>
            </Box>
        </MainMenuStyled>
    )
}
