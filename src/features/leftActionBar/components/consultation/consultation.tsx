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
import {upperFirst} from "lodash";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {consultationSelector} from "@features/toolbar";
import {toggleSideBar} from "@features/menu";
import {appLockSelector} from "@features/appLock";
import {onOpenPatientDrawer} from "@features/table";
import dynamic from "next/dynamic";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import Zoom from "react-medium-image-zoom";
import {useSpeechRecognition} from "react-speech-recognition";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import {capitalizeFirst, getBirthdayFormat, useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import ContentStyled from "./overrides/contantStyle";
import {ExpandAbleCard} from "@features/card";
import {dashLayoutSelector} from "@features/base";
import {useInsurances, useProfilePhoto} from "@lib/hooks/rest";
import {ImageHandler} from "@features/image";
import Content from "@features/leftActionBar/components/consultation/content";
import {DefaultCountry} from "@lib/constants";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import AddIcon from "@mui/icons-material/Add";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function Consultation() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {data: session} = useSession();
    const {data: user} = session as Session;

    const {transcript, listening, resetTranscript} = useSpeechRecognition();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {insurances: allInsurances} = useInsurances();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {t, ready} = useTranslation("consultation", {keyPrefix: "filter"});
    const {t: commonTranslation} = useTranslation("common");
    const {patient} = useAppSelector(consultationSelector);
    const {lock} = useAppSelector(appLockSelector);
    const {listen} = useAppSelector(consultationSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);


    const [loading, setLoading] = useState<boolean>(true);
    const [note, setNote] = useState("");
    const [isNote, setIsNote] = useState(false);
    const [moreNote, setMoreNote] = useState(false);
    const [isLong, setIsLong] = useState(false);
    const [collapseData, setCollapseData] = useState<any[]>([]);
    const [collapse, setCollapse] = useState<any>(-1);
    const [isStarted, setIsStarted] = useState(false);
    const [oldNote, setOldNote] = useState("");

    const {trigger: triggerPatientUpdate} = useRequestQueryMutation("/patient/update");

    const medical_entity = (user as UserDataResponse)?.medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;
    const isBeta = localStorage.getItem('newCashbox') ? localStorage.getItem('newCashbox') === '1' : user.medical_entity.hasDemo;

    const {patientPhoto} = useProfilePhoto({patientId: patient?.uuid, hasPhoto: patient?.hasPhoto});

    const editPatientInfo = () => {
        const params = new FormData();
        if (patient && medicalEntityHasUser) {
            const url = `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/${router.locale}`;

            params.append('attribute', 'note');
            params.append('value', note);

            triggerPatientUpdate({
                method: "PATCH",
                url,
                data: params,
            }, {
                onSuccess: () => invalidateQueries([url])
            });
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
            setNote(`${oldNote} ${transcript}`);
        }
    }, [transcript, isStarted]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (patient && !lock) {
            dispatch(toggleSideBar(false));

            setNote(patient.note ? patient.note : "");
            setLoading(false);
            let nb = 0
            Object.keys(patient?.antecedents).map(antecedent => {
                    if (antecedent !== 'way_of_life' && antecedent !== 'allergic')
                        nb += patient?.antecedents[antecedent]
                }
            )
            setCollapseData([
                {
                    id: 1,
                    title: "treatment_in_progress",
                    icon: "ic-medicament",
                    badge: patient?.treatments
                },
                {
                    id: 6,
                    title: "riskFactory",
                    icon: "ic-recherche",
                    badge: patient?.antecedents.way_of_life
                },
                {
                    id: 7,
                    title: "allergic",
                    icon: "allergies",
                    badge: patient?.antecedents.allergic
                },
                {
                    id: 4,
                    title: "antecedent",
                    icon: "ic-doc",
                    badge: nb
                },
                {
                    id: 9,
                    title: "balance_sheet",
                    icon: "ic-analyse",
                    badge: patient?.requestedAnalyses
                },
                {
                    id: 5,
                    title: "medical_imaging_pending",
                    icon: "ic-soura",
                    badge: patient?.requestedImaging
                },
                {
                    id: 8,
                    title: "documents",
                    icon: "ic-download",
                    badge: patient?.documents
                },
            ]);
        }
    }, [patient]); // eslint-disable-line react-hooks/exhaustive-deps

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
                        {patient?.insurances && patient?.insurances.length > 0 &&
                            <Stack direction='row' alignItems="center" spacing={1}>
                                <AvatarGroup max={3}>
                                    {patient?.insurances.map((insuranceItem: any) =>
                                        <Tooltip key={insuranceItem?.uuid}
                                                 title={insuranceItem?.name}>
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
                                    sx={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        width: 150
                                    }}>
                                    {patient?.firstName ? capitalizeFirst(patient.firstName) : ""} {patient?.lastName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {patient?.birthdate} {patient?.birthdate && <>({" "}{getBirthdayFormat(patient, t)}{" "})</>}
                                </Typography>

                                {patient?.contact && patient?.contact.length > 0 &&
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
                                        <Icon path="ic-phone"/>{patient?.contact[0]}
                                    </Typography>
                                }

                                {patient?.email && (
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
                                        {patient?.email}
                                    </Typography>
                                )}

                                {(isBeta && patient && patient.rest_amount !== 0) && <Button
                                    variant='contained'
                                    size={"small"}
                                    startIcon={<IconUrl path={'ic-wallet-money'} color={'white'}/>}
                                    sx={{
                                        "& .MuiSvgIcon-root": {
                                            width: 16,
                                            height: 16,
                                            pl: 0
                                        }
                                    }}>
                                    <Typography
                                        sx={{fontSize: 12}}>
                                        {`${-1 * Math.abs(patient.rest_amount)}`} {devise}</Typography>
                                </Button>}
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
                                        sx={{marginRight: 1.5}}
                                        color="warning"
                                    />
                                </Stack>
                            </ListItem>
                            <ListItem sx={{p: 0}}>
                                <Collapse in={collapse === col.id} sx={{width: 1}}>
                                    <Box px={1.5}>
                                        {collapse === col.id && <Content  {...{
                                            id: col.id,
                                            url: medicalEntityHasUser && `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/preview/${router.locale}`,
                                            patient
                                        }}/>}
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
