// components
import React, {useEffect, useState} from "react";
import ConsultationStyled from "./overrides/consultationStyled";
import {
    Avatar,
    AvatarGroup,
    Badge,
    Box,
    Button,
    CardContent,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    Skeleton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import Icon from "@themes/urlIcon";
import IconUrl from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import Content from "./content";
import {upperFirst} from "lodash";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {consultationSelector} from "@features/toolbar";
import {toggleSideBar} from "@features/menu";
import {appLockSelector} from "@features/appLock";
import {onOpenPatientDrawer} from "@features/table";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {useRequestMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import Zoom from "react-medium-image-zoom";
import {useSpeechRecognition,} from "react-speech-recognition";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import {getBirthdayFormat, useMedicalEntitySuffix} from "@lib/hooks";
import ContentStyled from "./overrides/contantStyle";
import {ExpandAbleCard} from "@features/card";
import {dashLayoutSelector} from "@features/base";
import {useAntecedentTypes, useInsurances, useProfilePhoto} from "@lib/hooks/rest";
import {useSWRConfig} from "swr";
import {ImageHandler} from "@features/image";

function Consultation() {
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {transcript, listening, resetTranscript} = useSpeechRecognition();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {insurances: allInsurances} = useInsurances();
    const {allAntecedents} = useAntecedentTypes();
    const {cache} = useSWRConfig();

    const {t, ready} = useTranslation("consultation", {keyPrefix: "filter"});
    const {patient, analyses, mi, patientAntecedent} = useAppSelector(consultationSelector);
    const {lock} = useAppSelector(appLockSelector);
    const {listen} = useAppSelector(consultationSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {patientPhoto} = useProfilePhoto({patientId: patient?.uuid, hasPhoto: patient?.hasPhoto});

    const [loading, setLoading] = useState<boolean>(true);
    const [number, setNumber] = useState<any>(null);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [insurances, setInsurances] = useState<any[]>([]);
    const [note, setNote] = useState("");
    const [isNote, setIsNote] = useState(false);
    const [moreNote, setMoreNote] = useState(false);
    const [isLong, setIsLong] = useState(false);
    const [collapseData, setCollapseData] = useState<any[]>([]);
    const [patientAntecedents, setPatientAntecedents] = useState<any>([]);
    const [collapse, setCollapse] = useState<any>(-1);
    const [isStarted, setIsStarted] = useState(false);
    const [oldNote, setOldNote] = useState("");
    const {trigger: triggerPatientUpdate} = useRequestMutation(null, "/patient/update");

    const editPatientInfo = () => {
        const params = new FormData();
        if (patient) {
            params.append("note", note);
            patient.fiche_id && params.append("fiche_id", patient.fiche_id);
            patient.email && params.append("email", patient.email);
            patient.familyDoctor && params.append("family_doctor", patient.familyDoctor);
            patient.profession && params.append("profession", patient.profession);
            patient.birthdate && params.append("birthdate", patient.birthdate);
            params.append("first_name", patient.firstName);
            params.append("last_name", patient.lastName);
            params.append("phone", JSON.stringify(patient.contact));
            params.append("gender", patient.gender === 'M' ? '1' : '2');
            patient?.address &&
            patient?.address.length > 0 &&
            patient?.address[0].city &&
            params.append("country", patient?.address[0]?.city?.country?.uuid);
            patient?.address &&
            patient?.address.length > 0 &&
            patient?.address[0].city &&
            params.append("region", patient?.address[0]?.city?.uuid);
            patient?.address &&
            patient?.address.length > 0 &&
            patient?.address[0].city &&
            params.append("zip_code", patient?.address[0]?.postalCode);
            if (patient?.address &&
                patient?.address.length > 0 &&
                patient?.address[0].street) {
                params.append("address", JSON.stringify({[router.locale as string]: patient?.address[0]?.street}));
            }
            patient.idCard && params.append("id_card", patient.idCard);
        }
        if (medicalEntityHasUser) {
            const url = `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/${router.locale}`;
            triggerPatientUpdate({
                method: "PUT",
                url,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                data: params,
            }).then(() => cache.delete(url));
        }
    };

    useEffect(() => {
        const noteContainer = document.getElementById("note-card-content");
        if (noteContainer) {
            if (noteContainer.clientHeight >= 153)
                setIsLong(true);
            else {
                setIsLong(false);
            }
        }
    }, [note]);

    useEffect(() => {
        if (isStarted) {
            setNote(oldNote + " " + transcript);
        }
    }, [transcript, isStarted]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (patient && !lock) {
            dispatch(toggleSideBar(false));
            setNumber(patient.contact[0]);
            setEmail(patient.email);
            setNote(patient.note ? patient.note : "");
            setName(`${patient.firstName} ${patient.lastName}`);
            setInsurances(patient.insurances as any);
            setLoading(false);
            let wayOfLifeBadge = 0;
            let allergicBadge = 0;
            let antecedentBadge = 0;

            if (patientAntecedent) {
                const res = patientAntecedent;
                setPatientAntecedents(res);
                if (res['way_of_life'])
                    wayOfLifeBadge = res['way_of_life'].length;

                if (res['allergic'])
                    allergicBadge = res['allergic']?.length;

                let nb = 0;
                Object.keys(res).forEach(ant => {
                    if (Array.isArray(res[ant]) && ant !== "way_of_life" && ant !== "allergic") {
                        nb += res[ant].length;
                    }
                });
                antecedentBadge = nb;
            }
            setCollapseData([
                {
                    id: 1,
                    title: "treatment_in_progress",
                    icon: "ic-medicament",
                    badge: patient?.treatment?.length,
                },
                {
                    id: 6,
                    title: "riskFactory",
                    icon: "ic-recherche",
                    badge: wayOfLifeBadge
                },
                {
                    id: 7,
                    title: "allergic",
                    icon: "allergies",
                    badge: allergicBadge
                },
                {
                    id: 4,
                    title: "antecedent",
                    icon: "ic-doc",
                    badge: antecedentBadge
                },
                {
                    id: 9,
                    title: "balance_sheet",
                    icon: "ic-analyse",
                    badge: patient.requestedAnalyses.length,
                },
                /*{
                    id: 2,
                    title: "balance_sheet_pending",
                    icon: "ic-analyse",
                    badge: patient.requestedAnalyses.length,
                },*/
                {
                    id: 5,
                    title: "medical_imaging_pending",
                    icon: "ic-soura",
                    badge: patient.requestedImaging.length,
                },
                {
                    id: 8,
                    title: "documents",
                    icon: "ic-download",
                    badge: 0,
                },
            ]);
        }
    }, [patient, patientAntecedent]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <ConsultationStyled>
            <Box className="header">
                <Stack direction={"row"} alignItems={"flex-start"}>
                    <Stack direction={"column"} alignItems={"center"} spacing={.5}>
                        <label htmlFor="contained-button-file">
                            <Zoom>
                                <Avatar
                                    src={
                                        patientPhoto
                                            ? patientPhoto.thumbnails.length > 0 ? patientPhoto.thumbnails.thumbnail_128 : patientPhoto.url
                                            : patient?.gender === "M"
                                                ? "/static/icons/men-avatar.svg"
                                                : "/static/icons/women-avatar.svg"
                                    }
                                    sx={{
                                        width: 59,
                                        height: 59,
                                        marginLeft: 2,
                                        marginRight: 2,
                                        borderRadius: 2,
                                    }}>
                                    <IconUrl width={"59"} height={"59"} path="men-avatar"/>
                                </Avatar>
                            </Zoom>
                        </label>
                        {insurances && insurances.length > 0 &&
                            <Stack direction='row' alignItems="center" spacing={1}>
                                <AvatarGroup max={3}>
                                    {insurances.map((insuranceItem: any) =>
                                        <Tooltip key={insuranceItem?.insurance.uuid}
                                                 title={insuranceItem?.insurance.name}>
                                            <Avatar variant={"circular"}>
                                                {allInsurances?.find((insurance: any) => insurance.uuid === insuranceItem?.insurance.uuid) &&

                                                    <ImageHandler
                                                        alt={insuranceItem?.insurance.name}
                                                        src={allInsurances.find(
                                                            (insurance: any) =>
                                                                insurance.uuid ===
                                                                insuranceItem?.insurance.uuid
                                                        )?.logoUrl?.url}
                                                    />}
                                            </Avatar>
                                        </Tooltip>
                                    )}
                                </AvatarGroup>
                            </Stack>}
                    </Stack>

                    <Box>
                        {loading ? (
                            <>
                                <Skeleton width={130} variant="text"/>
                                <Skeleton variant="text"/>
                                <Skeleton variant="text"/>
                                <Skeleton variant="text"/>
                            </>
                        ) : (
                            <Box style={{cursor: "pointer"}}>
                                <Typography
                                    variant="body1"
                                    color="primary.main"
                                    sx={{fontFamily: "Poppins"}}>
                                    {name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {patient?.birthdate} {patient?.birthdate && <>({" "}{getBirthdayFormat(patient, t)}{" "})</>}
                                </Typography>

                                {number && (
                                    <Typography
                                        component="div"
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            "& .react-svg": {mr: 0.8},
                                            mb: 0.3,
                                        }}
                                        variant="body2"
                                        color="text.secondary">
                                        <Icon path="ic-phone"/>
                                        {(number.code ? number.code + " " : "") + number.value}
                                    </Typography>
                                )}

                                {email && (
                                    <Typography
                                        component="div"
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            "& .react-svg": {mr: 0.8},
                                        }}
                                        variant="body2"
                                        color="text.secondary">
                                        <Icon path="ic-message-contour"/>
                                        {email}
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Box>

                    <Box
                        onClick={() => {
                            dispatch(onOpenPatientDrawer({patientId: patient?.uuid}));
                        }}>
                        <IconButton
                            size={"small"}
                            sx={{position: "absolute", top: 20, right: 10}}>
                            <Icon path={"ic-duotone"}/>
                        </IconButton>
                    </Box>
                </Stack>
                {patient?.fiche_id && (
                    <Stack spacing={1} mb={-2} mt={2} ml={3}>
                        {/*{false && <Alert icon="ic-danger" color="warning" sx={{borderTopRightRadius: 0, borderBottomRightRadius: 0}}>
                    <Typography color="text.primary">{upperFirst(t(`duplicate detection`))}</Typography>
                </Alert>}*/}
                        <Button
                            onClick={() => {
                                dispatch(onOpenPatientDrawer({patientId: patient?.uuid}));
                            }}
                            variant="consultationIP"
                            startIcon={<FolderRoundedIcon/>}
                            sx={{
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                px: 1.5,
                            }}>
                            {upperFirst(t("ficheID"))}{" "}
                            <span style={{fontWeight: "bold"}}>{patient?.fiche_id}</span>
                        </Button>
                    </Stack>
                )}
                <Box className="contact">
                    <ListItem
                        className="list-parent"

                        style={{padding: "13px 15px 3px 0", marginLeft: 8}}
                        onClick={() => {
                            setIsNote(!isNote);
                        }}>
                        <ListItemIcon>
                            <Icon path={"ic-text"}/>
                        </ListItemIcon>
                        <Typography fontWeight={700}>{upperFirst(t("note"))}</Typography>
                        <IconButton size="small" sx={{ml: "auto"}}>
                            <Icon path={isNote ? "arrow-up-table" : "ic-expand-more"}/>

                        </IconButton>
                    </ListItem>

                    {!isNote && note && note.trim().length > 0 && (
                        <Box style={{padding: 10, paddingBottom: 0}}>
                            <ContentStyled>
                                <CardContent id={"note-card-content"}
                                             className={!moreNote && isLong ? "note-container" : ""}
                                             onClick={() => {
                                                 setIsNote(!isNote)
                                             }} style={{paddingBottom: 5}}>
                                    <Typography
                                        fontStyle={"italic"}
                                        whiteSpace={"pre-line"}
                                        onClick={() => {
                                            setIsNote(true);
                                        }}
                                        variant="body2"
                                        color="text.secondary"
                                        overflow={"hidden"}
                                        textOverflow={"ellipsis"}
                                        display={"-webkit-box"}
                                        className={!moreNote && isLong ? "resumenote" : ""}>
                                        {note}
                                    </Typography>
                                    {!moreNote && isLong && <Button
                                        onClick={(ev) => {
                                            ev.stopPropagation();
                                            setMoreNote(true)
                                        }}
                                        size="small">
                                        <Typography className={"more-details-btn"}>{t("showNote")}</Typography>
                                    </Button>}

                                </CardContent>

                            </ContentStyled>

                        </Box>
                    )}

                    <Collapse in={isNote}>
                        <Box mr={2} ml={1}>
                            {(listen === "" || listen === "note") && (
                                <Stack alignItems={"end"} mt={1}>
                                    <ExpandAbleCard {...{
                                        note,
                                        setNote,
                                        setIsNote,
                                        editPatientInfo,
                                        t,
                                        resetTranscript,
                                        setIsStarted,
                                        listening,
                                        dispatch,
                                        setOldNote,
                                        isStarted
                                    }} />
                                </Stack>
                            )}
                        </Box>
                    </Collapse>
                </Box>
            </Box>
            <Stack ml={-1.25}>
                <List dense>
                    {collapseData?.map((col, idx: number) => (
                        <React.Fragment key={`list-item-${idx}`}>
                            <ListItem
                                className="list-parent"
                                onClick={() => setCollapse(collapse === col.id ? "" : col.id)}>
                                <ListItemIcon>
                                    <Icon path={col.icon}/>
                                </ListItemIcon>
                                <Typography fontWeight={700}>
                                    {upperFirst(t(col.title))}
                                    {col.id === 2 && (
                                        <Typography
                                            fontWeight={500}
                                            ml={1}
                                            component="span"></Typography>
                                    )}
                                </Typography>
                                <Stack sx={{ml: "auto"}} spacing={2} direction={"row"}>
                                    <Badge
                                        badgeContent={col.badge}
                                        sx={{marginTop: 1.5}}
                                        color="warning"
                                    />
                                    <IconButton size="small">
                                        <Icon path={collapse === col.id ? "arrow-up-table" : "ic-expand-more"}/>
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            <ListItem sx={{p: 0}}>
                                <Collapse in={collapse === col.id} sx={{width: 1}}>
                                    <Box px={1.5}>
                                        <Content id={col.id} {...{
                                            patient,
                                            patientAntecedents,
                                            allAntecedents,
                                            analyses,
                                            mi
                                        }} patient={patient}/>
                                    </Box>
                                </Collapse>
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>
            </Stack>
        </ConsultationStyled>
    );
}

export default Consultation;
