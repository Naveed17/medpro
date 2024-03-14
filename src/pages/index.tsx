import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    FormControlLabel,
    Grid, Menu, MenuItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import styles from '../styles/Home.module.scss'
import { LoadingScreen } from "@features/loadingScreen";
import axios from "axios";
import { logout } from "@features/menu";
import { useAppDispatch } from "@lib/redux/hooks";
import { Redirect } from "@features/redirect";
import IconUrl from "@themes/urlIcon";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function Home() {
    const router = useRouter();
    const { data: session, status, update } = useSession();
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const { t, ready } = useTranslation(['common', 'menu']);

    const [loading, setLoading] = useState(true);
    const [selectedMedicalEntity, setSelectedMedicalEntity] = useState<MedicalEntityModel | null>(null);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const dir = router.locale === 'ar' ? 'rtl' : 'ltr';

    const handleClick = (event: React.MouseEvent<HTMLElement>, medicalEntity: MedicalEntityModel) => {
        setSelectedMedicalEntity(medicalEntity);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectUserRoot = (root: string) => {
        update({ default_medical_entity: selectedMedicalEntity?.uuid, root });
        setAnchorEl(null);
    };

    const logOutSession = async () => {
        // Log out from keycloak session
        const {
            data: { path }
        } = await axios({
            url: "/api/auth/logout",
            method: "GET"
        });
        dispatch(logout({ redirect: true, path }));
    }

    useEffect(() => {
        if (status === "unauthenticated") {
            signIn('keycloak', { callbackUrl: (router.locale === 'ar' ? '/ar' : '/') });
        } else if (status === "authenticated") {
            setLoading(false);
        }
    }, [router, status]);

    if (!ready || loading) return (<LoadingScreen />);

    const medical_entities = (session?.data?.medical_entities?.reduce((entites: MedicalEntityModel[], data: any) =>
        [...(entites ?? []), { ...data?.medical_entity, isOwner: data.is_owner }], []) ?? []) as MedicalEntityModel[];
    const hasMultiMedicalEntities = medical_entities.length > 1 ?? false;
    const medicalEntity = session?.data?.medical_entity;
    const hasSelectedEntity = medicalEntity?.has_selected_entity ?? false;
    const features = session?.data?.medical_entities?.find((entity: MedicalEntityDefault) => entity.is_default)?.features;

    return ((!hasMultiMedicalEntities || hasSelectedEntity) ?
        <Redirect
            to={medicalEntity?.root === "admin" ? "/admin" : (features?.length > 0 ? `/dashboard/${features[0].root}` : `/dashboard/agenda`)} />
        :
        <Box className={styles.container} dir={dir}>
            <main className={styles.main}>
                {!session && (<Grid item xs={12} md={12}>
                    <Box mt={-2}>
                        <Typography
                            sx={{ fontSize: "28px", mb: 3 }}
                            textAlign="center"
                            component="h6"
                            fontFamily="Poppins-ExtraBold">
                            {t('login.sign_title')}
                        </Typography>
                        <Typography textAlign="center">
                            {t('login.sign_sub_title_1')} <br />
                            {t('login.sign_sub_title_2')}
                        </Typography>

                        <Button sx={{ '& img': { mr: 2 }, fontFamily: 'Poppins', fontSize: '16px', mt: 2 }}
                            startIcon={<Box component="img" width={20} height={20}
                                src="/static/icons/Med-logo_.svg" />}
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
                            <TextField sx={{ background: '#F9F9FB' }} fullWidth
                                placeholder={t('login.sign_email_placeholder')} />
                            <TextField sx={{ background: '#F9F9FB', mt: 1.2 }} fullWidth
                                placeholder={t('login.sign_pass_placeholder')} />
                            <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
                                <FormControlLabel control={<Checkbox />} label={t('login.sign_forget_pass')}
                                    sx={{ mr: '7px' }} />
                                <Link href="/"> {t('login.sign_reset_pass')}</Link>
                            </Box>
                        </Box>
                        <Button size="large" fullWidth sx={{ mt: 9 }}
                            variant="contained"> {t('login.sign_connect_btn')}</Button>
                    </Box>
                </Grid>)}
                {session?.user && (
                    <>
                        <Card sx={{
                            maxWidth: 514,
                            width: '100%',
                            borderRadius: 2,
                            border: 0,
                            boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.10)",
                            padding: 2
                        }}>
                            <CardHeader
                                component="div"
                                sx={{ pb: 0 }}
                                title={
                                    <Stack pb={2} direction='row' alignItems="center" flexWrap="wrap" justifyContent='space-between'
                                        borderBottom={1} borderColor="divider">
                                        <Stack>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {t('login.sign_in')}
                                            </Typography>
                                            <Typography variant="body2"
                                                fontWeight={500}>{session.user.email || session.user.name}</Typography>
                                        </Stack>
                                        <Button
                                            variant={"text-black"}
                                            sx={{ ml: 'auto' }}
                                            startIcon={
                                                <IconUrl path="ic-deconnexion" />
                                            }
                                            onClick={logOutSession}
                                            className={styles.button}>
                                            {t('main-menu.logout', { ns: 'menu' })}
                                        </Button>
                                    </Stack>
                                }
                            />
                            <CardContent>
                                <Stack spacing={2}>
                                    {medical_entities?.map(medical_entity_data =>
                                        <Stack spacing={1} key={medical_entity_data.uuid}>
                                            <a key={medical_entity_data.uuid}
                                                onClick={(event) => medical_entity_data.isOwner && ["doctor_office", "group_practice", "medical_center"].includes(medical_entity_data?.type?.slug as string) ? handleClick(event, medical_entity_data) : update({ default_medical_entity: medical_entity_data.uuid })}
                                                className={styles.card}>
                                                <Box component="img" width={50} height={50}
                                                    src="/static/icons/Med-logo_.svg" />
                                                <p
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: 600,
                                                        color: "#3F4254"
                                                    }}>{medical_entity_data?.name}</p>
                                                <ChevronRightIcon sx={{ ml: 'auto', color: "text.secondary" }} />
                                            </a>
                                        </Stack>)}
                                    <Typography variant="body2" textAlign='center'>
                                        {t("login.sign_in_desc_1")}
                                        <br />
                                        {t("login.sign_in_desc_2")}
                                    </Typography>
                                </Stack>
                                <Menu
                                    anchorEl={anchorEl}
                                    id="account-menu"
                                    open={open}
                                    onClose={handleClose}
                                    onClick={handleClose}
                                    slotProps={{
                                        paper: {
                                            elevation: 0,
                                            sx: {
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                mt: 1.5,
                                                '& .MuiAvatar-root': {
                                                    width: 32,
                                                    height: 32,
                                                    ml: -0.5,
                                                    mr: 1,
                                                },
                                                '&::before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 14,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: 'background.paper',
                                                    transform: 'translateY(-50%) rotate(45deg)',
                                                    zIndex: 0,
                                                },
                                            },
                                        }
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                    <MenuItem onClick={() => handleSelectUserRoot("admin")}>
                                        {t("admin-access")}
                                    </MenuItem>
                                    <MenuItem onClick={() => handleSelectUserRoot("dashboard")}>
                                        {t("user-access")}
                                    </MenuItem>
                                </Menu>
                            </CardContent>
                        </Card>
                    </>
                )}
            </main>
        </Box>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu']))
    }
})
export default Home;
