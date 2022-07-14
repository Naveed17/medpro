import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {ReactElement, useEffect, useState} from "react";
import {DashLayout} from "@features/base";
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
    Skeleton, DialogActions
} from "@mui/material";
import CardStyled from "@themes/overrides/cardStyled";
import IconUrl from "@themes/urlIcon";
import BasicAlert from "@themes/overrides/Alert"
import {RootStyled} from "@features/toolbar";
import {configSelector} from "@features/base";
import {Dialog} from "@features/dialog";
import {SubHeader} from "@features/subHeader";
import {useAppSelector} from "@app/redux/hooks";
import {checkListSelector} from "@features/checkList";
import { useRouter } from 'next/router'
import useRequest from "@app/axios/axiosServiceApi";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import CloseIcon from "@mui/icons-material/Close";

function Profil() {

    const router = useRouter();
    const {newAssurances, newMode, newLangues, newQualification} = useAppSelector(checkListSelector);
    const { data: session } = useSession();
    const [languages, setLanguages] = useState<LanguageModel[]>([]);
    const [open, setOpen] = useState(false);
    const [insurances, setInsurances] = useState<InsuranceModel[]>([]);
    const [paymentMeans, setPaymentMeans] = useState<PaymentMeansModel[]>([]);
    const [qualifications, setQualifications] = useState<QualificationModel[]>([]);
    const [info, setInfo] = useState<any[]>([]);
    const [name, setName] = useState<string>("");
    const [acts, setActs] = useState<MedicalProfessionalActModel[]>([]);
    const [speciality, setSpeciality] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const initalData = Array.from(new Array(3));

    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const {data, error} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/prfessionals/" + router.locale,
        headers:  { Authorization: `Bearer ${session?.accessToken}`}
    });

    useEffect(() => {
        if (data !== undefined) {
            const infoData = (data as any).data;
            const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;
            setName(medical_professional.publicName);
            setLanguages(medical_professional.languages);
            setSpeciality(medical_professional.specialities.filter((spe: any) => spe.isMain)[0].speciality.name);
            setLoading(false);
            setInsurances([]);
            setPaymentMeans([]);
            setQualifications((infoData.qualification) as QualificationModel[])
            setActs(infoData.acts)
        }
        if (error !== undefined) {
            console.log(error)
        }
    }, [data, error, user])

    const [dialogContent, setDialogContent] = useState('');
    const {direction} = useAppSelector(configSelector);

    const {t, ready} = useTranslation('settings',{ keyPrefix: "profil" });
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
                setInsurances(newAssurances);
                break;
            case "mode":
                setPaymentMeans(newMode);
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
                setInfo(insurances)
                break;
            case "mode":
                setInfo(paymentMeans)
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
                                    <Skeleton sx={{borderRadius: 1}} variant="rectangular">
                                        <Avatar src='/static/img/avatar.svg'/>
                                    </Skeleton> :
                                    <Avatar
                                        src={medical_entity.profilePhoto ? medical_entity.profilePhoto : '/static/img/avatar.svg'}/>
                            }
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">{loading ?
                                <Skeleton width={150} variant="text"/> : name}</Typography>
                        </Grid>
                    </Grid>
                </RootStyled>
            </SubHeader>
            <Box bgcolor={theme => theme.palette.background.default} sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <CardStyled>
                    <CardContent>
                        <List>
                            <ListItem>
                                <Stack spacing={2.3} direction="row" alignItems="flex-start" width={1}>
                                    <IconUrl className='left-icon' path="ic-doctor-h"/>
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2"
                                                    fontWeight={600}>{t('specialities')}</Typography>
                                        <Button variant="outlined" color="info">
                                            {loading ? <Skeleton width={50} variant="text"/> : speciality}
                                        </Button>
                                        <BasicAlert icon="danger"
                                                    data={t('contact')}
                                                    color="warning">info</BasicAlert>
                                    </Stack>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack spacing={2.3} direction="row" alignItems="flex-start" width={1}>
                                    <IconUrl className='left-icon' path="ic-education"/>
                                    <Stack spacing={0.5} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2" gutterBottom
                                                    fontWeight={600}>{t('qualification')}</Typography>

                                        {
                                            loading ?
                                                initalData.map((item, index) => (
                                                    <Typography key={index} fontWeight={400}>
                                                        <Skeleton width={250}/>
                                                    </Typography>
                                                )) :
                                                qualifications.length > 0 ?
                                                    qualifications.map((item, index) => (
                                                        <Typography key={index} fontWeight={400}>
                                                            {item.title}
                                                        </Typography>
                                                    )) : <Typography color={"gray"} fontWeight={400}>
                                                        {t('noQualification')}
                                                    </Typography>
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
                                                    fontWeight={600}>{t('assurence')}</Typography>
                                        <Stack spacing={2.5} direction="row" alignItems="flex-start" width={1}>
                                            {
                                                loading ?
                                                    initalData.map((item, index) => (
                                                        <Skeleton sx={{borderRadius: 1}} variant="rectangular"
                                                                  key={index} width={35} height={35}/>
                                                    )) :
                                                    insurances.length > 0 ?
                                                        insurances.map((item: any) => (
                                                            <Box key={item.id} component="img" width={35} height={35}
                                                                 src={item.img}/>
                                                        )) : <Typography color={"gray"} fontWeight={400}>
                                                            {t('noInsurance')}
                                                        </Typography>
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
                                                    fontWeight={600}>{t('regMode')}</Typography>
                                        <Stack spacing={1} direction="row" alignItems="flex-start" width={1}>
                                            {
                                                loading ?
                                                    initalData.map((mode: any, index) => (
                                                        <Button key={index} variant="outlined" color="info"
                                                                onClick={() => dialogOpen('mode')}>
                                                            {<Skeleton width={50} variant="text"/>}
                                                        </Button>
                                                    )) :
                                                    paymentMeans.length > 0 ?
                                                        paymentMeans.map((mode: any) => (
                                                            <Button key={mode.id} variant="outlined" color="info"
                                                                    onClick={() => dialogOpen('mode')}>
                                                                {mode.name}
                                                            </Button>
                                                        )) : <Typography color={"gray"} fontWeight={400}>
                                                            {t('noPaymentMean')}
                                                        </Typography>
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
                                                    fontWeight={600}>{t('langues')}</Typography>
                                        <Stack spacing={1} direction="row" alignItems="flex-start" width={1}>
                                            {
                                                loading ?
                                                    initalData.map((language: any, index) => (
                                                        <Button key={index} variant="outlined" color="info"
                                                                onClick={() => dialogOpen('langues')}>
                                                            {<Skeleton width={50} variant="text"/>}
                                                        </Button>
                                                    )) :
                                                    languages.length > 0 ?
                                                        languages.map((language: any) => (
                                                            <Button key={language.language.code} variant="outlined"
                                                                    color="info"
                                                                    onClick={() => dialogOpen('langues')}>
                                                                {language.language.name}
                                                            </Button>
                                                        )) : <Typography color={"gray"} fontWeight={400}>
                                                            {t('noLanguage')}
                                                        </Typography>
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
                                                    fontWeight={600}>{t('actes')}</Typography>
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
                                                    acts.filter((act: MedicalProfessionalActModel) => act.isTopAct).length > 0 ?
                                                        acts.filter((act: MedicalProfessionalActModel) => act.isTopAct).map((item: MedicalProfessionalActModel) => (
                                                            <Button key={item.uuid} variant="outlined" color="info"
                                                                    onClick={(e) => console.log(e)}>
                                                                {item.act.name}
                                                            </Button>
                                                        )) : <Typography color={"gray"} fontWeight={400}>
                                                            {t('noActes')}
                                                        </Typography>
                                            }
                                        </Stack>
                                    </Stack>
                                    <IconButton size="small" color="primary"
                                                onClick={() => router.push('/dashboard/settings/actes')}>
                                        <IconUrl path="ic-edit"/>
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            {acts.filter(a => !a.isTopAct).length > 0 && <ListItem>
                                <Stack spacing={4} direction="row" alignItems="flex-start" width={1}>
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2" gutterBottom
                                                    fontWeight={600}>{t('actesSec')}</Typography>
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
                                                    acts.filter(a => !a.isTopAct).map((item: MedicalProfessionalActModel) => (
                                                        <Button key={item.uuid} variant="outlined" color="info"
                                                                onClick={(e) => console.log(e)}>
                                                            {item.act.name}
                                                        </Button>
                                                    ))
                                            }
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </ListItem>}
                        </List>
                    </CardContent>
                </CardStyled>

                <Dialog action={dialogContent}
                        open={open}
                        data={info}
                        direction={direction}
                        title={t('dialogs.titles.' + dialogContent)}
                        t={t}
                        dialogSave={dialogSave}
                        dialogClose={dialogClose}
                        actionDialog={
                            <DialogActions>
                                <Button onClick={dialogClose} startIcon={<CloseIcon/>}>{t('cancel')}</Button>
                                <Button variant="contained"
                                        onClick={dialogSave}
                                        startIcon={<IconUrl path='ic-dowlaodfile'></IconUrl>}>{t('save')}</Button>
                            </DialogActions>
                        }
                />

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
