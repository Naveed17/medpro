import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {ReactElement, useEffect, useState} from "react";
import DashLayout from "@features/base/components/dashLayout/dashLayout";
import {
    CardContent,
    List,
    ListItem,
    Stack,
    Typography,
    Button,
    IconButton,
    Box,
    Grid,
    Avatar,
    Skeleton
} from "@mui/material";
import CardStyled from "@themes/overrides/cardStyled";
import IconUrl from "@themes/urlIcon";
import BasicAlert from "@themes/overrides/Alert"
import {RootStyled} from "@features/toolbar/components/calendarToolbar";
import {configSelector} from "@features/base";
import { SettingsDialogs } from "@features/settingsDialogs";
import {SubHeader} from "@features/subHeader";
import {useAppSelector} from "@app/redux/hooks";
import {checkListSelector} from "@features/checkList";
import Qualifications from "@interfaces/Qualifications";
import { useRouter } from 'next/router'
import useRequest from "@app/axios/axiosServiceApi";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";

function Profil() {

    const router = useRouter();
    const {newAssurances, newMode, newLangues, newQualification} = useAppSelector(checkListSelector);
    const { data: session, status } = useSession();
    const [languages, setLanguages] = useState<LanguageModel[]>([]);
    const [open, setOpen] = useState(false);
    const [assurances, setAssurances] = useState<InsuranceModel[]>([]);
    const [modes, setModes] = useState<PaymentMeansModel[]>([]);
    const [qualifications, setQualifications] = useState<Qualifications[]>([]);
    const [info, setInfo] = useState<any[]>([]);
    const [name, setName] = useState<string>("");
    const [speciality, setSpeciality] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const initalData = Array.from(new Array(3));

    const headers = {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
    }

    const { data: user } = session as Session;
    const medical_entity = (user as any).data.medical_entities.filter((m:any) => m.is_default)[0].medical_entity;
    const { data, error } = useRequest({
        method: "GET",
        url: "/api/medical/entity/profile/"+medical_entity.uuid+"/"+router.locale,
        headers
    });

    useEffect(() => {
        if (data !== undefined){
            // @ts-ignore
            const medical_professional = data.data.medical_professional;
            setName(medical_professional.publicName);
            setLanguages(medical_professional.languages);
            setSpeciality(medical_professional.speciality.filter((spe:any) => spe.isMain)[0].speciality.name);
            setLoading(false);
        }
    },[data])

    useEffect(() => {
        setAssurances([
/*
            {id: 3, name: 'ASSURANCES BIAT', img: '/static/assurances/biat.svg'},
            {id: 7, name: 'CARTE ASSURANCES', img: '/static/assurances/carte.svg'}
*/
        ]);

        setModes([]);

        setQualifications([
            {id: 1, name: 'Thèse de Doctorat en Médecine'},
            {id: 2, name: 'Diplôme de Spécialiste en Dermatologie Vénéréologie'},
            {id: 3, name: 'Diplôme Inter Universitaire Cosmetologie'},
            {id: 4, name: 'Diplôme Inter Universitaire de Laser en Dermatologie'}
        ]);

    }, []);

    const [dialogContent, setDialogContent] = useState('');
    const {direction} = useAppSelector(configSelector);

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
                setLanguages(newLangues);
                break;
            default:
                break;
        }

    };

    const dialogOpen = (action: string) => {
        setDialogContent(action);
        switch (action) {
            case "qualification":
                setInfo(qualifications)
                break;
            case "assurance":
                setInfo(assurances)
                break;
            case "mode":
                setInfo(modes)
                break;
            case "langues":
                setInfo(languages)
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
                            {
                                loading ?
                                    <Skeleton sx={{borderRadius:1}} variant="rectangular">
                                        <Avatar src='/static/img/avatar.svg'/>
                                    </Skeleton> :
                                <Avatar
                                src={medical_entity.profilePhoto ? medical_entity.profilePhoto : '/static/img/avatar.svg'}/>
                            }
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">{loading ? <Skeleton width={150} variant="text"/> : name}</Typography>
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
                                            {loading ? <Skeleton width={50} variant="text"/> :speciality}
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
                                            loading ?
                                            qualifications.map((item: any) => (
                                                <Typography key={item.id} fontWeight={400}>
                                                    <Skeleton width={250}/>
                                                </Typography>
                                            )) :
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
                                                loading ?
                                                    initalData.map((item,index) => (
                                                        <Skeleton sx={{borderRadius:1}} variant="rectangular" key={index} width={35} height={35} />
                                                    )) :
                                                    assurances.map((item: any) => (
                                                        <Box key={item.id} component="img" width={35} height={35}
                                                             src={item.img}/>
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
                                                loading ?
                                                    initalData.map((mode: any,index) => (
                                                    <Button key={index} variant="outlined" color="info"
                                                            onClick={() => dialogOpen('mode')}>
                                                        {<Skeleton width={50} variant="text"/>}
                                                    </Button>
                                                )):
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
                                                loading ?
                                                    initalData.map((language: any,index) => (
                                                    <Button key={index} variant="outlined" color="info"
                                                            onClick={() => dialogOpen('langues')}>
                                                        {<Skeleton width={50} variant="text"/>}
                                                    </Button>
                                                )):
                                                    languages.map((language: any) => (
                                                        <Button key={language.language.code} variant="outlined" color="info"
                                                                onClick={() => dialogOpen('langues')}>
                                                            {language.language.name}
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
                                        <Stack spacing={1} direction={{xs: 'column', md: 'row'}} alignItems="flex-start" width={1}>
                                            {
                                                loading ?
                                                    initalData.map((language: any,index) => (
                                                        <Button key={index} variant="outlined" color="info"
                                                                onClick={(e) => console.log(e)}>
                                                            {<Skeleton width={50} variant="text"/>}
                                                        </Button>
                                                    )) :
                                                    <>
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

                                                    </>
                                            }
                                        </Stack>
                                    </Stack>
                                    <IconButton size="small" color="primary"
                                                onClick={() => router.push('/dashboard/settings/actes')}>
                                        <IconUrl path="ic-edit"/>
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack spacing={4} direction="row" alignItems="flex-start" width={1}>
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2" gutterBottom
                                                    fontWeight={600}>{t('profil.actesSec')}</Typography>
                                        <Stack spacing={1} direction={{xs: 'column', md: 'row'}} alignItems="flex-start"
                                               width={1}>
                                            {
                                                loading ?
                                                    initalData.map((language: any, index) => (
                                                        <Button key={index} variant="outlined" color="info"
                                                                onClick={(e) => console.log(e)}>
                                                            {<Skeleton width={50} variant="text"/>}
                                                        </Button>
                                                    )) :
                                                    <>
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
                                                    </>
                                            }
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </ListItem>
                        </List>
                    </CardContent>
                </CardStyled>

                <SettingsDialogs action={dialogContent}
                                 open={open}
                                 data={info}
                                 direction={direction}
                                 title={t('dialogs.titles.' + dialogContent)}
                                 t={t}
                                 dialogSave={dialogSave}
                                 dialogClose={dialogClose}/>

            </Box>
        </>
    )
}
export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale  as string, ['common', 'menu','settings']))
    }
})
export default Profil

Profil.auth = true;

Profil.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
