import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useRouter} from "next/router";
import {signIn, useSession} from "next-auth/react";
import React, {useEffect, useState} from "react";
import {Box, Button, Checkbox, FormControlLabel, Grid, Stack, TextField} from "@mui/material";
import Typography from "@themes/typography";
import {useTranslation} from "next-i18next";
import Link from "next/link";
import {useTheme} from "@mui/material/styles";
import styles from '../styles/Home.module.scss'
import {LoadingScreen} from "@features/loadingScreen";
import axios from "axios";
import {logout} from "@features/menu";
import {useAppDispatch} from "@lib/redux/hooks";
import {Redirect} from "@features/redirect";

function Home() {
    const router = useRouter();
    const {data: session, status} = useSession();
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(true);

    const dir = router.locale === 'ar' ? 'rtl' : 'ltr';

    const {t, ready} = useTranslation(['common', 'menu']);

    const logOutSession = async () => {
        // Log out from keycloak session
        const {
            data: {path}
        } = await axios({
            url: "/api/auth/logout",
            method: "GET"
        });
        dispatch(logout({redirect: true, path}));
    }

    useEffect(() => {
        if (status === "unauthenticated") {
            signIn('keycloak', {callbackUrl: (router.locale === 'ar' ? '/ar/dashboard/agenda' : '/dashboard/agenda')});

        } else if (status === "authenticated") {
            // void router.push(router.locale === 'ar' ? '/ar/dashboard/agenda' : '/dashboard/agenda');
            setLoading(false);
        }
    }, [router, status]);

    if (!ready || loading) return (<LoadingScreen/>);
    console.log("session", session)

    const medical_entities = (session?.data?.medical_entities?.reduce((entites: MedicalEntityModel[], data: any) => [...(entites ?? []), data?.medical_entity], []) ?? []) as MedicalEntityModel[];
    const hasMultiMedicalEntities = medical_entities.length > 1 ?? false;

    console.log("medical_entities", medical_entities)
    return (!hasMultiMedicalEntities ?
            <Redirect to='/dashboard/agenda'/>
            :
            <Box className={styles.container} dir={dir}>
                <main className={styles.main}>
                    {!session && (<Grid item xs={12} md={12}>
                        <Box mt={-2}>
                            <Typography
                                sx={{fontSize: "28px", mb: 3}}
                                textAlign="center"
                                component="h6"
                                fontFamily="Poppins-ExtraBold">
                                {t('login.sign_title')}
                            </Typography>
                            <Typography textAlign="center">
                                {t('login.sign_sub_title_1')} <br/>
                                {t('login.sign_sub_title_2')}
                            </Typography>

                            <Button sx={{'& img': {mr: 2}, fontFamily: 'Poppins', fontSize: '16px', mt: 2}}
                                    startIcon={<Box component="img" width={20} height={20}
                                                    src="/static/icons/Med-logo_.svg"/>}
                                    variant={"google"}
                                    fullWidth>
                                {t('login.sign_med_connect')}
                            </Button>
                            <Box sx={{
                                height: '2px',
                                backgroundColor: 'divider',
                                mt: 5,
                                mb: 8,
                                width: '75%',
                                mx: 'auto',
                                position: 'relative',
                                '& p': {
                                    position: 'absolute',
                                    px: 1.5,
                                    backgroundColor: theme.palette.background.default,
                                    left: '50%',
                                    color: "#C9C8C8",
                                    transform: 'translateX(-50%)',
                                    top: -10
                                }
                            }}>
                                <Typography>
                                    {t('login.sign_divider')}
                                </Typography>
                            </Box>
                            <Box>
                                <TextField sx={{background: '#F9F9FB'}} fullWidth
                                           placeholder={t('login.sign_email_placeholder')}/>
                                <TextField sx={{background: '#F9F9FB', mt: 1.2}} fullWidth
                                           placeholder={t('login.sign_pass_placeholder')}/>
                                <Box sx={{display: 'flex', justifyContent: "space-between", alignItems: 'center'}}>
                                    <FormControlLabel control={<Checkbox/>} label={t('login.sign_forget_pass')}
                                                      sx={{mr: '7px'}}/>
                                    <Link href="/"> {t('login.sign_reset_pass')}</Link>
                                </Box>
                            </Box>
                            <Button size="large" fullWidth sx={{mt: 9}}
                                    variant="contained"> {t('login.sign_connect_btn')}</Button>
                        </Box>
                    </Grid>)}
                    {session?.user && (
                        <>
                        <span className={styles.signedInText}>
                <small>{t('login.sign_in')}</small>
                <br/>
                <strong>{session.user.email || session.user.name}</strong>
              </span>

                            <Stack direction={"row"} sx={{cursor: "pointer"}}>
                                {medical_entities?.map(medical_entity_data =>
                                    <a
                                        style={{width: 180}}
                                        key={medical_entity_data.uuid}
                                        onClick={() => router.push('/dashboard')}
                                        className={styles.card}>
                                        <Box component="img" width={60} height={60} src="/static/icons/Med-logo_.svg"/>
                                        <p style={{fontSize: 14, fontWeight: 600}}>{medical_entity_data?.name}</p>
                                    </a>)}
                            </Stack>


                            <Button
                                variant="google"
                                onClick={logOutSession}
                                className={styles.button}>
                                {t('main-menu.logout', {ns: 'menu'})}
                            </Button>
                        </>
                    )}
                </main>
            </Box>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu']))
    }
})
export default Home;
