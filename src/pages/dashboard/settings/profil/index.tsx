import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {DashLayout, dashLayoutSelector} from "@features/base";
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
    Skeleton,
    DialogActions,
    useMediaQuery,
    Theme, Tooltip,
} from "@mui/material";
import CardStyled from "@themes/overrides/cardStyled";
import IconUrl from "@themes/urlIcon";
import BasicAlert from "@themes/overrides/Alert";
import {RootStyled} from "@features/toolbar";
import {configSelector} from "@features/base";
import {Dialog} from "@features/dialog";
import {SubHeader} from "@features/subHeader";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {checkListSelector} from "@features/checkList";
import {useRouter} from "next/router";
import {useRequestMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import CloseIcon from "@mui/icons-material/Close";
import {toggleSideBar} from "@features/menu";
import {appLockSelector} from "@features/appLock";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {useMedicalEntitySuffix} from "@lib/hooks";
import {ImageHandler} from "@features/image";
import {useSWRConfig} from "swr";

function Profil() {
    const {data: session} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {mutate} = useSWRConfig();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    const {t, ready} = useTranslation("settings");
    const {direction} = useAppSelector(configSelector);
    const {newAssurances, newMode, newLangues, newQualification} = useAppSelector(checkListSelector);
    const {lock} = useAppSelector(appLockSelector);
    const {medicalProfessionalData} = useAppSelector(dashLayoutSelector);

    const [languages, setLanguages] = useState<LanguageModel[]>([]);
    const [open, setOpen] = useState(false);
    const [insurances, setInsurances] = useState<InsuranceModel[]>([]);
    const [paymentMeans, setPaymentMeans] = useState<PaymentMeansModel[]>([]);
    const [qualifications, setQualifications] = useState<QualificationModel[]>([]);
    const [info, setInfo] = useState<any[]>([]);
    const [name, setName] = useState<string>("");
    const [acts, setActs] = useState<MedicalProfessionalActModel[]>([]);
    const [speciality, setSpeciality] = useState<string>("");
    const [medical_professional_uuid, setMedicalProfessionalUuid] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const initialData = Array.from(new Array(3));

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {trigger} = useRequestMutation(null, "/settings");

    useEffect(() => {
        if (medicalProfessionalData) {
            const infoData = medicalProfessionalData[0];
            const medical_professional = infoData.medical_professional as MedicalProfessionalModel;
            setName(medical_professional?.publicName);
            let lngs: LanguageModel[] = [];
            medical_professional?.languages.map((lang) => lngs.push(lang.language));
            setLanguages(lngs);
            setSpeciality(
                medical_professional?.specialities.filter((spe: any) => spe.isMain)[0]
                    .speciality.name
            );
            setLoading(false);
            setMedicalProfessionalUuid(medical_professional?.uuid);
            setInsurances(infoData.insurances);
            setPaymentMeans(infoData.payments);
            setQualifications(infoData.qualification);
            setActs(infoData.acts);
        }

        if (!lock) {
            dispatch(toggleSideBar(false));
        }
    }, [dispatch, medicalProfessionalData, user]);// eslint-disable-line react-hooks/exhaustive-deps

    const [dialogContent, setDialogContent] = useState("");

    if (!ready) return (<LoadingScreen  button text={"loading-error"}/>);

    const dialogClose = () => {
        setOpen(false);
    };

    const mutateMedicalProfessionalData = () => {
        mutate(`${urlMedicalEntitySuffix}/professionals/${router.locale}`);
    };

    const dialogSave = () => {
        setOpen(false);
        switch (dialogContent) {
            case "qualification":
                setQualifications(newQualification);
                let qualifs = "";
                newQualification.map(
                    (qualification) => (qualifs += qualification.uuid + ",")
                );
                qualifs = qualifs.substring(0, qualifs.length - 1);
                editQualification(qualifs);
                break;
            case "assurance":
                let inscurances = "";
                newAssurances.map(
                    (inscurance) => (inscurances += inscurance.uuid + ",")
                );
                inscurances = inscurances.substring(0, inscurances.length - 1);
                editInscurance(inscurances);
                setInsurances(newAssurances);
                break;
            case "mode":
                let paymentMeans = "";
                newMode.map((paymentMean) => (paymentMeans += paymentMean.uuid + ","));
                paymentMeans = paymentMeans.substring(0, paymentMeans.length - 1);
                editPaymentMeans(paymentMeans);
                setPaymentMeans(newMode);
                break;
            case "langues":
                let languages = "";
                newLangues.map((langue) => (languages += langue.uuid + ","));
                languages = languages.substring(0, languages.length - 1);
                editLanguages(languages);
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
                setInfo(qualifications);
                break;
            case "assurance":
                setInfo(insurances);
                break;
            case "mode":
                setInfo(paymentMeans);
                break;
            case "langues":
                setInfo(languages);
                break;
            default:
                break;
        }
        setOpen(true);
    };

    const editQualification = (qualif: string) => {
        const form = new FormData();
        form.append("qualifications", qualif);
        trigger({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/professionals/${medical_professional_uuid}/qualifications/${router.locale}`,
            data: form
        }).then(() => mutateMedicalProfessionalData());
    };

    const editInscurance = (inscurance: string) => {
        const form = new FormData();
        form.append("insurance", inscurance);
        trigger({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/professionals/insurance/${router.locale}`,
            data: form
        }).then(() => mutateMedicalProfessionalData());
    };

    const editLanguages = (languages: string) => {
        const form = new FormData();
        form.append("languages", languages);
        trigger({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/professionals/${medical_professional_uuid}/languages/${router.locale}`,
            data: form
        }).then(() => mutateMedicalProfessionalData());
    };

    const editPaymentMeans = (paymentMeans: string) => {
        const form = new FormData();
        form.append("paymentMeans", paymentMeans);
        trigger({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/professionals/paymentMeans/${router.locale}`,
            data: form
        }).then(() => mutateMedicalProfessionalData());
    };

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <Grid container spacing={1} direction="row" alignItems="center">
                        <Grid item>
                            {loading ? (
                                <Skeleton sx={{borderRadius: 1}} variant="rectangular">
                                    <Avatar src="/static/img/avatar.svg"/>
                                </Skeleton>
                            ) : (
                                <Avatar
                                    src={
                                        medical_entity.profilePhoto
                                            ? medical_entity.profilePhoto
                                            : "/static/img/avatar.svg"
                                    }
                                />
                            )}
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">
                                {loading ? <Skeleton width={150} variant="text"/> : name}
                            </Typography>
                        </Grid>
                    </Grid>
                </RootStyled>
            </SubHeader>
            <Box
                bgcolor={(theme) => theme.palette.background.default}
                sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <CardStyled>
                    <CardContent>
                        <List>
                            <ListItem>
                                <Stack
                                    spacing={2.3}
                                    direction="row"
                                    alignItems="flex-start"
                                    width={1}>
                                    <IconUrl className="left-icon" path="ic-doctor-h"/>
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {t("profil.specialities")}
                                        </Typography>
                                        <Button
                                            {...(isMobile && {fullWidth: true})}
                                            variant="outlined"
                                            color="info">
                                            {loading ? (
                                                <Skeleton width={50} variant="text"/>
                                            ) : (
                                                speciality
                                            )}
                                        </Button>
                                        <BasicAlert
                                            icon="danger"
                                            data={t("profil.contact")}
                                            color="warning">
                                            info
                                        </BasicAlert>
                                    </Stack>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack
                                    spacing={2.3}
                                    direction="row"
                                    alignItems="flex-start"
                                    width={1}>
                                    <IconUrl className="left-icon" path="ic-education"/>
                                    <Stack spacing={0.5} alignItems="flex-start" width={1}>
                                        <Typography
                                            variant="subtitle2"
                                            gutterBottom
                                            fontWeight={600}>
                                            {t("profil.qualification")}
                                        </Typography>

                                        {loading ? (
                                            initialData.map((item, index) => (
                                                <Typography key={index} fontWeight={400}>
                                                    <Skeleton width={250}/>
                                                </Typography>
                                            ))
                                        ) : qualifications.length > 0 ? (
                                            qualifications.map((item, index) => (
                                                <Typography key={index} fontWeight={400}>
                                                    {item.title}
                                                </Typography>
                                            ))
                                        ) : (
                                            <Typography color={"gray"} fontWeight={400}>
                                                {t("profil.noQualification")}
                                            </Typography>
                                        )}
                                    </Stack>
                                    {/*<IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => dialogOpen("qualification")}>
                                        <IconUrl path="ic-edit"/>
                                    </IconButton>*/}
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack
                                    spacing={2.3}
                                    direction="row"
                                    alignItems="flex-start"
                                    width={1}>
                                    <IconUrl className="left-icon" path="ic-assurance"/>
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography
                                            variant="subtitle2"
                                            gutterBottom
                                            fontWeight={600}>
                                            {t("profil.assurence")}
                                        </Typography>
                                        <Stack
                                            spacing={1.2}
                                            direction="row"
                                            alignItems="flex-start">
                                            {loading ? (
                                                initialData.map((item, index) => (
                                                    <Skeleton
                                                        sx={{borderRadius: 1}}
                                                        variant="rectangular"
                                                        key={index}
                                                        width={35}
                                                        height={35}
                                                    />
                                                ))
                                            ) : insurances.length > 0 ? (
                                                insurances.map((insuranceItem: any) => (
                                                    <Tooltip
                                                        key={insuranceItem?.uuid}
                                                        title={insuranceItem?.name}>
                                                        <Avatar variant={"square"} color={"white"}>
                                                            <ImageHandler
                                                                width={32}
                                                                height={32}
                                                                alt={insuranceItem?.name}
                                                                src={insuranceItem.logoUrl.url}
                                                            />
                                                        </Avatar>
                                                    </Tooltip>
                                                ))
                                            ) : (
                                                <Typography color={"gray"} fontWeight={400}>
                                                    {t("profil.noInsurance")}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Stack>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => dialogOpen("assurance")}>
                                        <IconUrl path="ic-edit"/>
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack
                                    spacing={2.3}
                                    direction="row"
                                    alignItems="flex-start"
                                    width={1}>
                                    <IconUrl className="left-icon" path="ic-argent"/>
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography
                                            variant="subtitle2"
                                            gutterBottom
                                            fontWeight={600}>
                                            {t("profil.regMode")}
                                        </Typography>
                                        <Stack
                                            spacing={1}
                                            direction={{xs: "column", md: "row"}}
                                            alignItems={{xs: "stretch", md: "flex-start"}}
                                            width={1}>
                                            {loading ? (
                                                initialData.map((mode: any, index) => (
                                                    <Button
                                                        key={index}
                                                        variant="outlined"
                                                        color="info"
                                                        onClick={() => dialogOpen("mode")}>
                                                        {<Skeleton width={50} variant="text"/>}
                                                    </Button>
                                                ))
                                            ) : paymentMeans.length > 0 ? (
                                                paymentMeans.map((mode: any) => (
                                                    <Button
                                                        key={mode.uuid}
                                                        variant="outlined"
                                                        color="info"
                                                        onClick={() => dialogOpen("mode")}>
                                                        {mode.name}
                                                    </Button>
                                                ))
                                            ) : (
                                                <Typography color={"gray"} fontWeight={400}>
                                                    {t("profil.noPaymentMean")}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Stack>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => dialogOpen("mode")}>
                                        <IconUrl path="ic-edit"/>
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack
                                    spacing={2.3}
                                    direction="row"
                                    alignItems="flex-start"
                                    width={1}>
                                    <IconUrl className="left-icon" path="ic-langue2"/>
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography
                                            variant="subtitle2"
                                            gutterBottom
                                            fontWeight={600}>
                                            {t("profil.langues")}
                                        </Typography>
                                        <Stack
                                            spacing={1}
                                            direction={{xs: "column", md: "row"}}
                                            alignItems={{xs: "stretch", md: "flex-start"}}
                                            width={1}>
                                            {loading ? (
                                                initialData.map((language: any, index) => (
                                                    <Button
                                                        key={index}
                                                        variant="outlined"
                                                        color="info"
                                                        onClick={() => dialogOpen("langues")}>
                                                        {<Skeleton width={50} variant="text"/>}
                                                    </Button>
                                                ))
                                            ) : languages.length > 0 ? (
                                                languages.map((language: any) => (
                                                    <Button
                                                        key={language.code}
                                                        variant="outlined"
                                                        color="info"
                                                        onClick={() => dialogOpen("langues")}>
                                                        {language.name}
                                                    </Button>
                                                ))
                                            ) : (
                                                <Typography color={"gray"} fontWeight={400}>
                                                    {t("profil.noLanguage")}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Stack>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => dialogOpen("langues")}>
                                        <IconUrl path="ic-edit"/>
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack
                                    spacing={2.3}
                                    direction="row"
                                    alignItems="flex-start"
                                    width={1}>
                                    <IconUrl className="left-icon" path="ic-generaliste"/>
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography
                                            variant="subtitle2"
                                            gutterBottom
                                            fontWeight={600}>
                                            {t("profil.actes")}
                                        </Typography>
                                        <Stack
                                            flexWrap="wrap"
                                            direction={{xs: "column", md: "row"}}
                                            alignItems={{xs: "stretch", md: "flex-start"}}
                                            width={1}>
                                            {loading ? (
                                                initialData.map((language: any, index) => (
                                                    <Button
                                                        sx={{
                                                            mr: 1,
                                                            mt: 1,
                                                        }}
                                                        key={index}
                                                        variant="outlined"
                                                        color="info"
                                                        onClick={(e) => console.log(e)}>
                                                        {<Skeleton width={50} variant="text"/>}
                                                    </Button>
                                                ))
                                            ) : acts?.filter(
                                                (act: MedicalProfessionalActModel) => act.isTopAct
                                            ).length > 0 ? (
                                                acts
                                                    .filter(
                                                        (act: MedicalProfessionalActModel) => act.isTopAct
                                                    )
                                                    .map((item: MedicalProfessionalActModel) => (
                                                        <Button
                                                            sx={{
                                                                mr: 1,
                                                                mt: 1,
                                                            }}
                                                            key={item.uuid}
                                                            variant="outlined"
                                                            color="info"
                                                            onClick={(e) => console.log(e)}>
                                                            {item.act.name}
                                                        </Button>
                                                    ))
                                            ) : (
                                                <Typography color={"gray"} fontWeight={400}>
                                                    {t("profil.noActes")}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Stack>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => router.push("/dashboard/settings/actfees")}>
                                        <IconUrl path="ic-edit"/>
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            {acts?.filter((a) => !a.isTopAct).length > 0 && (
                                <ListItem>
                                    <Stack
                                        spacing={4}
                                        direction="row"
                                        alignItems="flex-start"
                                        width={1}>
                                        <Stack spacing={1} alignItems="flex-start" width={1}>
                                            <Typography
                                                variant="subtitle2"
                                                gutterBottom
                                                fontWeight={600}>
                                                {t("profil.actesSec")}
                                            </Typography>
                                            <Stack
                                                flexWrap="wrap"
                                                direction={{xs: "column", md: "row"}}
                                                alignItems={{xs: "stretch", md: "flex-start"}}
                                                width={1}>
                                                {loading
                                                    ? initialData.map((language: any, index) => (
                                                        <Button
                                                            sx={{
                                                                mb: 1,
                                                                mr: 1,
                                                            }}
                                                            key={index}
                                                            variant="outlined"
                                                            color="info"
                                                            onClick={(e) => console.log(e)}>
                                                            {<Skeleton width={50} variant="text"/>}
                                                        </Button>
                                                    ))
                                                    : acts
                                                        .filter((a) => !a.isTopAct)
                                                        .map((item: MedicalProfessionalActModel) => (
                                                            <Button
                                                                key={item.uuid}
                                                                variant="outlined"
                                                                sx={{
                                                                    mb: 1,
                                                                    mr: 1,
                                                                }}
                                                                color="info"
                                                                onClick={(e) => console.log(e)}>
                                                                {item.act.name}
                                                            </Button>
                                                        ))}
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </ListItem>
                            )}
                        </List>
                    </CardContent>
                </CardStyled>
                <Dialog
                    {...{dialogSave, dialogClose, open, direction, t}}
                    action={dialogContent}
                    data={info}
                    title={t("dialogs.titles." + dialogContent)}
                    size={"sm"}
                    actionDialog={
                        <DialogActions>
                            <Button onClick={dialogClose} startIcon={<CloseIcon/>}>
                                {t("profil.cancel")}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={dialogSave}
                                startIcon={<IconUrl path="ic-dowlaodfile"></IconUrl>}>
                                {t("profil.save")}
                            </Button>
                        </DialogActions>
                    }
                />
            </Box>
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "patient",
            "settings",
        ])),
    },
});
export default Profil;

Profil.auth = true;

Profil.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
