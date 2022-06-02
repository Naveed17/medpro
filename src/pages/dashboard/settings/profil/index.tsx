import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {ReactElement, useState} from "react";
import DashLayout from "@features/base/dashLayout";
import {CardContent, List, ListItem, Stack, Typography, Button, IconButton, Box, Grid, Avatar} from "@mui/material";
import CardStyled from "./overrides/cardStyled";
import IconUrl from "@themes/urlIcon";
import BasicAlert from "@themes/overrides/Alert"
import {RootStyled} from "@features/calendarToolbar";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import {useSelector} from "react-redux";
import {configSelector} from "@features/setConfig";
import { SettingsDialogs } from "@features/settingsDialogs";
import {SubHeader} from "@features/subHeader";

function Profil() {
    const [open, setOpen] = useState(false);
    const [dialogContent, setdialogContent] = useState('');
    const {direction} = useSelector(configSelector);


    const {t, ready} = useTranslation('settings');
    if (!ready) return (<>loading translations...</>);

    const dialogClose = () => {
        setOpen(false);
    };

    const dialogOpen = (action: string) => {
        setdialogContent(action);
        setOpen(true);
    };

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <Grid
                        container
                        spacing={1}
                        direction="row"
                        alignItems="center">
                        <Grid item>
                            <Avatar src="/static/img/avatar.svg"/>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">Dr. Ahmed Yassine EHA</Typography>
                        </Grid>
                    </Grid>
                </RootStyled>
            </SubHeader>
            <Box bgcolor="#F0FAFF" sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <CardStyled>
                    <CardContent>
                        <List>
                            <ListItem>
                                <Stack spacing={2.3} direction="row" alignItems="flex-start" width={1}>
                                    <IconUrl className='left-icon' path="ic-doctor-h"/>
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2"
                                                    fontWeight={600}>{t('profil.specialities')}</Typography>
                                        <Button variant="outlined" color="info" onClick={(e) => console.log(e)}>
                                            Dermatologue
                                        </Button>
                                        <BasicAlert icon="danger"
                                                    data={t('profil.contact')}
                                                    color="warning">info</BasicAlert>
                                    </Stack>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack spacing={2.3} direction="row" alignItems="flex-start" width={1}>
                                    <IconUrl className='left-icon' path="ic-education"/>
                                    <Stack spacing={0.5} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2" gutterBottom
                                                    fontWeight={600}>{t('profil.qualification')}</Typography>
                                        <Typography fontWeight={400}>
                                            Thèse de Doctorat en Médecine
                                        </Typography>
                                        <Typography fontWeight={400}>
                                            Diplôme de Spécialiste en Dermatologie Vénéréologie
                                        </Typography>
                                        <Typography>
                                            Diplôme Inter Universitaire Cosmetologie
                                        </Typography>
                                        <Typography>
                                            Diplôme Inter Universitaire de Laser en Dermatologie
                                        </Typography>
                                    </Stack>
                                    <IconButton size="small" color="primary"
                                                onClick={() => dialogOpen('qualification')}>
                                        <IconUrl path="ic-edit"/>
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack spacing={2.3} direction="row" alignItems="flex-start" width={1}>
                                    <IconUrl className='left-icon' path="ic-assurance"/>
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2" gutterBottom
                                                    fontWeight={600}>{t('profil.assurence')}</Typography>
                                        <Stack spacing={2.5} direction="row" alignItems="flex-start" width={1}>
                                            <Box component="img" width={35} height={35}
                                                 src="/static/assurances/biat.svg"
                                            />
                                            <Box component="img" width={35} height={35}
                                                 src="/static/assurances/carte.svg"/>
                                        </Stack>
                                    </Stack>
                                    <IconButton size="small" color="primary" onClick={() => dialogOpen('assurance')}>
                                        <IconUrl path="ic-edit"/>
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack spacing={2.3} direction="row" alignItems="flex-start" width={1}>
                                    <IconUrl className='left-icon' path="ic-argent"/>
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2" gutterBottom
                                                    fontWeight={600}>{t('profil.regMode')}</Typography>
                                        <Stack spacing={1} direction="row" alignItems="flex-start" width={1}>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Espèces
                                            </Button>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Chèque
                                            </Button>
                                        </Stack>
                                    </Stack>
                                    <IconButton size="small" color="primary" onClick={() => dialogOpen('mode')}>
                                        <IconUrl path="ic-edit"/>
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack spacing={2.3} direction="row" alignItems="flex-start" width={1}>
                                    <IconUrl className='left-icon' path="ic-langue2"/>
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2" gutterBottom
                                                    fontWeight={600}>{t('profil.langues')}</Typography>
                                        <Stack spacing={1} direction="row" alignItems="flex-start" width={1}>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Français
                                            </Button>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Arabe
                                            </Button>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Italien
                                            </Button>

                                        </Stack>
                                    </Stack>
                                    <IconButton size="small" color="primary" onClick={() => dialogOpen('langues')}>
                                        <IconUrl path="ic-edit"/>
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack spacing={2.3} direction="row" alignItems="flex-start" width={1}>
                                    <IconUrl className='left-icon' path="ic-generaliste"/>
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2" gutterBottom
                                                    fontWeight={600}>{t('profil.actes')}</Typography>
                                        <Stack spacing={1} direction={{xs: 'column', md: 'row'}} alignItems="flex-start"
                                               width={1}>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Relissage fractionnel
                                            </Button>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Prise en charge de lacné
                                            </Button>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Traitement Médical et Chirurgical des Cheveux
                                            </Button>

                                        </Stack>
                                    </Stack>
                                    <IconButton size="small" color="primary" onClick={(e) => console.log(e)}>
                                        <IconUrl path="ic-edit"/>
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack spacing={4} direction="row" alignItems="flex-start" width={1}>
                                    {/*<Icon className='left-icon' path={null} />*/}
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2" gutterBottom
                                                    fontWeight={600}>{t('profil.actesSec')}</Typography>
                                        <Stack spacing={1} direction={{xs: 'column', md: 'row'}} alignItems="flex-start"
                                               width={1}>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Relissage fractionnel
                                            </Button>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Prise en charge de lacné
                                            </Button>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Traitement Médical et Chirurgical des Cheveux
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </ListItem>
                        </List>
                    </CardContent>
                </CardStyled>

                <SettingsDialogs action={dialogContent}
                                 open={open}
                                 direction={direction}
                                 title={t('dialogs.titles.'+dialogContent)}
                                 t={t}
                                 dialogClose={dialogClose}></SettingsDialogs>

            </Box>
        </>
    )
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu','settings']))
    }
})
export default Profil

Profil.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
