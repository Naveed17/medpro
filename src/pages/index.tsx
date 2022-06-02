import type { NextPage } from 'next'
import styles from '../styles/Home.module.scss'
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import {
    Box, Button, Checkbox, FormControlLabel, Grid,
    SelectChangeEvent, TextField,
    Typography,
    useTheme
} from "@mui/material";
import {setTheme} from "@features/setConfig/actions";
import {useRouter} from "next/router";
import {useAppDispatch} from "@app/redux/hooks";
import dynamic from 'next/dynamic';
import Link from "@themes/Link";
import {signIn, signOut, useSession} from "next-auth/react";
const Footer = dynamic(() => import('@features/base/footer'));

const Home: NextPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const dir = router.locale === 'ar' ? 'rtl': 'ltr';
    const theme = useTheme();
    const { data: session, status } = useSession();
    const loading = status === 'loading'

    const { t, ready } = useTranslation(['common', 'menu']);

    if (!ready) return (<>loading translations...</>);

    if (loading) return (<>loading session...</>);

    const currentLang =  router.locale;
    const handleChange = (event: SelectChangeEvent) => {
        const lang = event.target.value as string;
        router.push(router.pathname, router.pathname, { locale: lang });
    };

    const toggleTheme = (mode: string) => {
        dispatch(setTheme(mode));
    }

  return (
    <div className={styles.container} dir={dir}>
        <main className={styles.main}>

            {!session && (<Grid item xs={12} md={12}>
                <Box mt={-2}>
                    <Typography
                        sx={{ fontSize: "28px", mb: 3 }}
                        textAlign="center"
                        component="h6"
                        fontFamily="Poppins-ExtraBold"
                    >
                        {t('login.sign_title')}
                    </Typography>
                            <Typography textAlign="center">
                                {t('login.sign_sub_title_1')} <br />
                                {t('login.sign_sub_title_2')}
                            </Typography>

                            <Button sx={{ '& img': { mr: 2 }, fontFamily: 'Poppins', fontSize: '16px', mt: 2 }}
                                    startIcon={<Box component="img"  width={20} height={20} src="/static/icons/Med-logo_.svg"  />}
                                    variant={"google"}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        signIn('keycloak', { callbackUrl: '/dashboard'})
                                    }} fullWidth>
                                {t('login.sign_med_connect')}
                            </Button>
                            <Box sx={{ height: '2px', backgroundColor: 'divider', mt: 5, mb: 8, width: '75%', mx: 'auto', position: 'relative', '& p': { position: 'absolute', px: 1.5, backgroundColor: theme.palette.background.default, left: '50%', color: "#C9C8C8", transform: 'translateX(-50%)', top: -10 } }}>
                                <Typography>
                                    {t('login.sign_divider')}
                                </Typography>
                            </Box>
                            <Box>
                                <TextField sx={{ background: '#F9F9FB'}} fullWidth placeholder={t('login.sign_email_placeholder')} />
                                <TextField sx={{ background: '#F9F9FB',  mt: 1.2 }} fullWidth placeholder={t('login.sign_pass_placeholder')} />
                                <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
                                    <FormControlLabel control={<Checkbox />} label={t('login.sign_forget_pass')} sx={{ mr: '7px' }} />
                                    <Link underline="hover" href="/"> {t('login.sign_reset_pass')}</Link>
                                </Box>
                            </Box>
                            <Button size="large" fullWidth sx={{ mt: 9 }} variant="contained"> {t('login.sign_connect_btn')}</Button>

                </Box>
            </Grid>)}
            {session?.user && (
                <>
              <span
                  style={{ backgroundImage: `url(${session.user.image})` }}
                  className={styles.avatar}
              />
                    <span className={styles.signedInText}>
                <small>{t('login.sign_in')}</small>
                <br />
                <strong>{session.user.email || session.user.name}</strong>
              </span>

                    <a onClick={()=> router.push('/dashboard')} className={styles.card}>
                        <Box component="img"  width={60} height={60} src="/static/icons/Med-logo_.svg"  />
                        <p>{t('dashboard')}</p>
                    </a>

                    <Button
                        variant="google"
                        href={`/api/auth/signout`}
                        className={styles.button}
                        onClick={(e) => {
                            e.preventDefault()
                            signOut()
                        }}
                    >
                        {t('main-menu.logout', { ns: 'menu' })}
                    </Button>
                </>
            )}
        </main>

        <Footer/>
    </div>
  )
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common','menu']))
    }
})
export default Home
