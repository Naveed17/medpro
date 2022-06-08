import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {ReactElement, useEffect, useState} from "react";
import DashLayout from "@features/base/dashLayout";
import {CardContent, List, ListItem, Stack, Typography, Button, IconButton, Box, Grid, Avatar} from "@mui/material";
import CardStyled from "./overrides/cardStyled";
import IconUrl from "@themes/urlIcon";
import BasicAlert from "@themes/overrides/Alert"
import {RootStyled} from "@features/calendarToolbar";
import {useSelector} from "react-redux";
import {configSelector} from "@features/setConfig";
import { SettingsDialogs } from "@features/settingsDialogs";
import {SubHeader} from "@features/subHeader";
import {useAppSelector} from "@app/redux/hooks";
import {checkListSelector} from "@features/checkList";
import Assurance from "@interfaces/Assurance";
import ModeReg from "@interfaces/ModeReg";
import Langues from "@interfaces/Langues";
import Qualifications from "@interfaces/Qualifications";
import { useRouter } from 'next/router'

function Profil() {

    const {newAssurances, newMode, newLangues, newQualification} = useAppSelector(checkListSelector);

    const [open, setOpen] = useState(false);
    const [assurances, setAssurances] = useState<Assurance[]>([]);
    const [modes, setModes] = useState<ModeReg[]>([]);
    const [langues, setLangues] = useState<Langues[]>([]);
    const [qualifications, setQualifications] = useState<Qualifications[]>([]);
    const [data, setData] = useState<any[]>([]);

    const router = useRouter()
    useEffect(() => {
        setAssurances([
            {id: 3, name: 'ASSURANCES BIAT', img: '/static/assurances/biat.svg'},
            {id: 7, name: 'CARTE ASSURANCES', img: '/static/assurances/carte.svg'}
        ]);

        setModes([
            {id: 1, name: 'Espèces', name_ar: ''},
            {id: 2, name: 'Chèque', name_ar: ''},
        ]);

        setLangues([
            {id: 1, name: 'Français', name_ar: ''},
            {id: 4, name: 'Arabe', name_ar: ''}
        ]);

        setQualifications([
            {id:1, name:'Thèse de Doctorat en Médecine'},
            {id: 2, name: 'Diplôme de Spécialiste en Dermatologie Vénéréologie'},
            {id: 3, name: 'Diplôme Inter Universitaire Cosmetologie'},
            {id: 4, name: 'Diplôme Inter Universitaire de Laser en Dermatologie'}
        ]);

    }, []);

    const [dialogContent, setDialogContent] = useState('');
    const {direction} = useSelector(configSelector);

    const {t, ready} = useTranslation('settings');
    if (!ready) return (<>loading translations...</>);

    const dialogClose = () => {
        setOpen(false);
    };

    const dialogSave = () => {
        setOpen(false);
        switch (dialogContent) {
            case "qualification":
                setQualifications(newQualification);
                break;
            case "assurance":
                setAssurances(newAssurances);
                break;
            case "mode":
                setModes(newMode);
                break;
            case "langues":
                setLangues(newLangues);
                break;
            default:
                break;
        }

    };

    const dialogOpen = (action: string) => {
        setDialogContent(action);
        switch (action) {
            case "qualification":
                setData(qualifications)
                break;
            case "assurance":
                setData(assurances)
                break;
            case "mode":
                setData(modes)
                break;
            case "langues":
                setData(langues)
                break;
            default:
                break;
        }
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
                                        <Button variant="outlined" color="info">
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

                                        {
                                            qualifications.map((item: any) => (
                                                <Typography key={item.id} fontWeight={400}>
                                                    {item.name}
                                                </Typography>
                                            ))
                                        }

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
                                            {
                                                assurances.map((item: any) => (
                                                    <Box key={item.id} component="img" width={35} height={35}
                                                         src={item.img}></Box>
                                                ))
                                            }
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
                                            {
                                                modes.map((mode: any) => (
                                                    <Button key={mode.id} variant="outlined" color="info"
                                                            onClick={() => dialogOpen('mode')}>
                                                        {mode.name}
                                                    </Button>
                                                ))

                                            }
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
                                            {
                                                langues.map((langue: any) => (
                                                    <Button key={langue.id} variant="outlined" color="info"
                                                            onClick={() => dialogOpen('langues')}>
                                                        {langue.name}
                                                    </Button>
                                                ))
                                            }
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
                                    <IconButton size="small" color="primary" onClick={() => router.push('/dashboard/settings/actes')}>
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
                                 data={data}
                                 direction={direction}
                                 title={t('dialogs.titles.' + dialogContent)}
                                 t={t}
                                 dialogSave={dialogSave}
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
