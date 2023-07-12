// components
import {
    Button,
    CardContent,
    DialogActions,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    Stack,
    Typography,
} from "@mui/material";
import Icon from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import ContentStyled from "./overrides/contantStyle";
import CircleIcon from "@mui/icons-material/Circle";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import React, {useState} from "react";
import Add from "@mui/icons-material/Add";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {openDrawer} from "@features/calendar";
import {pxToRem} from "@themes/formatFontSize";
import {consultationSelector} from "@features/toolbar/components/consultationIPToolbar/selectors";
import {useRequest, useRequestMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {resetAppointment, setAppointmentPatient, setOpenUploadDialog} from "@features/tabPanel";
import moment from "moment/moment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {SetSelectedApp} from "@features/toolbar";
import Antecedent from "@features/leftActionBar/components/consultation/antecedent";
import {LoadingScreen} from "@features/loadingScreen";
import {Theme} from "@mui/material/styles";
import {LoadingButton} from "@mui/lab";
import {DocumentCard} from "@features/card";
import {onOpenPatientDrawer} from "@features/table";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {configSelector, dashLayoutSelector} from "@features/base";
import {useSWRConfig} from "swr";

const Content = ({...props}) => {
    const {id, patient, patientAntecedents, allAntecedents, analyses, mi} = props;
    const dispatch = useAppDispatch();
    const {data: session, status} = useSession();
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t, ready} = useTranslation("consultation", {keyPrefix: "filter"});
    const {direction} = useAppSelector(configSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {mutate: mutateInfo, mutateDoc} = useAppSelector(consultationSelector);
    const {mutate} = useSWRConfig();

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [info, setInfo] = useState<string>("");
    const [infoDynamic, setInfoDynamic] = useState<string>("");
    const [size, setSize] = useState<string>("sm");
    const [state, setState] = useState<AntecedentsModel[] | FamilyAntecedentsModel[]>([]);
    const [selected, setSelected] = useState<any>();
    const [openRemove, setOpenRemove] = useState(false);
    const [document, setDocument] = useState<any>();
    const [openDialogDoc, setOpenDialogDoc] = useState<boolean>(false);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {trigger} = useRequestMutation(null, "/antecedent");

    const getTitle = () => {
        const info = allAntecedents.find((ant: { slug: any; }) => ant.slug === infoDynamic);

        if (info) {
            return info.name;
        }
        return t(infoDynamic)
    }

    const handleClickDialog = () => {
        setOpenDialog(true);
    }

    const handleCloseDialogDoc = () => {
        setOpenDialogDoc(false);
    }

    const handleCloseDialog = () => {
        const form = new FormData();
        if (allAntecedents.find((ant: { slug: any; }) => ant.slug === infoDynamic)) {
            form.append("antecedents", JSON.stringify(state));
            form.append("patient_uuid", patient.uuid);
            medicalEntityHasUser && trigger({
                    method: "POST",
                    url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient.uuid}/antecedents/${allAntecedents.find((ant: {
                        slug: any;
                    }) => ant.slug === infoDynamic).uuid}/${router.locale}`,
                    data: form,
                    headers: {
                        ContentType: "multipart/form-data",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                },
                {revalidate: true, populateCache: true}
            ).then(() => {
                mutateInfo();
                medicalEntityHasUser && mutate( `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/antecedents/${router.locale}`)
            });
        } else if (info === "add_treatment") {
            form.append("globalNote", "");
            form.append("isOtherProfessional", "true");
            form.append("drugs", JSON.stringify(state));
            trigger(
                {
                    method: "POST",
                    url: `${urlMedicalEntitySuffix}/appointments/${router.query["uuid-consultation"]}/prescriptions/${router.locale}`,
                    data: form,
                    headers: {
                        ContentType: "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                },
                {revalidate: true, populateCache: true}
            ).then(() => {
                mutateInfo();
                medicalEntityHasUser && mutate( `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/antecedents/${router.locale}`)
                setState([]);
            });
        } else if (info === "balance_sheet_pending") {
            form.append("analysesResult", JSON.stringify((state as any).hasAnalysis));

            trigger(
                {
                    method: "PUT",
                    url: `${urlMedicalEntitySuffix}/appointments/${
                        router.query["uuid-consultation"]
                    }/requested-analysis/${(state as any).uuid}/${router.locale}`,
                    data: form,
                    headers: {
                        ContentType: "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                },
                {revalidate: true, populateCache: true}
            ).then(() => {
                mutateInfo();
                medicalEntityHasUser &&  mutate(`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/antecedents/${router.locale}`)
            });
        } else if (info === "medical_imaging_pending") {
            mutateInfo();
            medicalEntityHasUser && mutate(`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/antecedents/${router.locale}`)
            mutateDoc();
        }

        setOpenDialog(false);
        setInfo("");
        setInfoDynamic("");
    };

    const dialogSave = () => {
        trigger(selected.request, {revalidate: true, populateCache: true}).then(
            () => {
                mutateInfo();
                medicalEntityHasUser && mutate(`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/antecedents/${router.locale}`)
            }
        );
        setOpenRemove(false);
    };

    const handleOpen = (action: string) => {
        if (action === "consultation") {
            dispatch(resetAppointment());
            dispatch(setAppointmentPatient(patient));
            dispatch(openDrawer({type: "add", open: true}));
            return;
        }

        if (Object.keys(patientAntecedents).find(key => key === action)) setState(patientAntecedents[action]);

        setInfo(action);
        setInfoDynamic(action)
        setSize("sm");
        handleClickDialog();
    };

    const handleOpenDynamic = (action: string) => {
        if (Object.keys(patientAntecedents).find(key => key === action)) setState(patientAntecedents[action]);
        setInfo("dynamicAnt");
        setInfoDynamic(action);
        setSize("sm");
        handleClickDialog();
    }

    const showDoc = (card: any) => {
        let type = "";
        if (!(patient.birthdate && moment().diff(moment(patient?.birthdate, "DD-MM-YYYY"), 'years') < 18))
            type = patient.gender === "F" ? "Mme " : patient.gender === "U" ? "" : "Mr "

        if (card.documentType === "medical-certificate") {
            setOpenDialogDoc(true);
            setDocument({
                uuid: card.uuid,
                certifUuid: card.certificate[0].uuid,
                content: card.certificate[0].content,
                doctor: card.name,
                patient: `${type} ${
                    patient.firstName
                } ${patient.lastName}`,
                days: card.days,
                description: card.description,
                createdAt: card.createdAt,
                name: "certif",
                type: "write_certif",
                detectedType: card.type,
                mutate: mutatePatientDocuments,
            });
            setOpenDialogDoc(true);
        } else {
            setOpenDialogDoc(true);
            let info = card;
            let uuidDoc = "";
            switch (card.documentType) {
                case "prescription":
                    info = card.prescription[0].prescription_has_drugs;
                    uuidDoc = card.prescription[0].uuid;
                    break;
                case "requested-analysis":
                    info = card.requested_Analyses[0].analyses;
                    uuidDoc = card.requested_Analyses[0].uuid;
                    break;
                case "requested-medical-imaging":
                    info = card.medical_imaging[0]["medical-imaging"];
                    uuidDoc = card.medical_imaging[0].uuid;
                    break;
            }
            setDocument({
                uuid: card.uuid,
                uri: card.uri,
                name: card.title,
                type: card.documentType,
                detectedType: card.type,
                info: info,
                uuidDoc: uuidDoc,
                description: card.description,
                createdAt: card.createdAt,
                patient: `${type} ${
                    patient.firstName
                } ${patient.lastName}`,
                mutate: mutatePatientDocuments,
            });
            setOpenDialogDoc(true);
        }
    };

    const {
        data: httpPatientDocumentsResponse,
        mutate: mutatePatientDocuments
    } = useRequest(medicalEntityHasUser && patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient.uuid}/documents/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`},
    } : null);

    const patientDocuments = (httpPatientDocumentsResponse as HttpResponse)?.data;

    const treatements = patient?.treatment.filter((trait: {
        isOtherProfessional: boolean;
    }) => trait.isOtherProfessional)
    const ordonnaces = patient?.treatment.filter((trait: {
        isOtherProfessional: boolean;
    }) => !trait.isOtherProfessional)

    if (!ready || status === "loading") return (
        <LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <React.Fragment>
            {id === 1 || id === 3 ? (
                <ContentStyled>
                    <CardContent style={{paddingBottom: pxToRem(15)}}>
                        {id === 1 && (
                            <Stack spacing={1} alignItems="flex-start">
                                <List dense>
                                    {treatements.length > 0 && (
                                        <Typography fontSize={11} fontWeight={"bold"} mt={1}>
                                            {t("tip")}
                                        </Typography>
                                    )}

                                    {treatements.map((list: any, index: number) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <CircleIcon/>
                                            </ListItemIcon>
                                            <Typography variant="body2" color={"text.secondary"}>
                                                {list.name} {list.duration > 0 ? ` / ${list.duration} ${t(list.durationType)}` : ''}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setSelected({
                                                        title: t("askRemoveTrait"),
                                                        subtitle: t("subtitleRemoveTrait"),
                                                        icon: "/static/icons/ic-medicament.svg",
                                                        name1: list.name,
                                                        name2: `${list.duration ? list.duration : ''} ${list.durationType ? t(list.durationType) : ''}`,
                                                        request: {
                                                            method: "PATCH",
                                                            url: `${urlMedicalEntitySuffix}/appointments/${router.query["uuid-consultation"]}/prescription-has-drugs/${list.uuid}/${router.locale}`,
                                                            headers: {
                                                                ContentType:
                                                                    "application/x-www-form-urlencoded",
                                                                Authorization: `Bearer ${session?.accessToken}`,
                                                            },
                                                        },
                                                    });
                                                    setOpenRemove(true);
                                                }}
                                                sx={{ml: "auto"}}>
                                                <Icon path="setting/icdelete"/>
                                            </IconButton>
                                        </ListItem>
                                    ))}

                                    {ordonnaces.length > 0 && (
                                        <Typography fontSize={11} fontWeight={"bold"} mt={1}>
                                            {t("prescription")}
                                        </Typography>
                                    )}
                                    {ordonnaces.map((list: any, index: number) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <CircleIcon/>
                                            </ListItemIcon>
                                            <Typography variant="body2">
                                                {list.name} {list.duration > 0 ? ` / ${list.duration} ${t(list.durationType)}` : ''}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setSelected({
                                                        title: t("askRemoveTrait"),
                                                        subtitle: t("subtitleRemoveTrait"),
                                                        icon: "/static/icons/ic-medicament.svg",
                                                        name1: list.name,
                                                        name2: `${list.duration} ${t(list.durationType)}`,
                                                        request: {
                                                            method: "PATCH",
                                                            url: `${urlMedicalEntitySuffix}/appointments/${router.query["uuid-consultation"]}/prescription-has-drugs/${list.uuid}/${router.locale}`,
                                                            headers: {
                                                                ContentType:
                                                                    "application/x-www-form-urlencoded",
                                                                Authorization: `Bearer ${session?.accessToken}`,
                                                            },
                                                        },
                                                    });
                                                    setOpenRemove(true);
                                                }}
                                                sx={{ml: "auto"}}>
                                                <Icon path="setting/icdelete"/>
                                            </IconButton>
                                        </ListItem>
                                    ))}
                                </List>
                                <Button
                                    onClick={() => handleOpen("add_treatment")}
                                    size="small"
                                    style={{paddingBottom: pxToRem(0)}}
                                    startIcon={<Add/>}>
                                    {t("add")}
                                </Button>
                            </Stack>
                        )}
                        {id === 3 && (
                            <Stack spacing={1} alignItems="flex-start">
                                {
                                    <List dense>
                                        {patient &&
                                            patient?.previousAppointments?.map(
                                                (
                                                    list: {
                                                        uuid: string;
                                                        status: number;
                                                        dayDate: moment.MomentInput;
                                                        startTime:
                                                            | string
                                                            | number
                                                            | boolean
                                                            | React.ReactElement<
                                                            any,
                                                            string | React.JSXElementConstructor<any>
                                                        >
                                                            | React.ReactFragment
                                                            | React.ReactPortal
                                                            | null
                                                            | undefined;
                                                    },
                                                    index: number
                                                ) => (
                                                    <ListItem
                                                        key={index}
                                                        onClick={() => {
                                                            dispatch(SetSelectedApp(list.uuid));
                                                            setTimeout(() => {
                                                                const myElement = document.getElementById(
                                                                    list.uuid
                                                                );
                                                                const topPos = myElement?.offsetTop;
                                                                if (topPos) {
                                                                    window.scrollTo(0, topPos - 10);
                                                                    setSelectedDate(list.uuid);
                                                                }
                                                            }, 1000);
                                                        }}>
                                                        <ListItemIcon>
                                                            <CircleIcon/>
                                                        </ListItemIcon>
                                                        <Typography
                                                            variant="body2"
                                                            color={
                                                                selectedDate === list.uuid || list.status === 5
                                                                    ? ""
                                                                    : "text.secondary"
                                                            }
                                                            fontWeight={
                                                                selectedDate === list.uuid ? "bold" : ""
                                                            }
                                                            textTransform={"capitalize"}>
                                                            {moment(list.dayDate, "DD-MM-YYYY").format(
                                                                "ddd DD-MM-YYYY"
                                                            )}
                                                            <AccessTimeIcon
                                                                style={{
                                                                    marginBottom: "-1px",
                                                                    width: 18,
                                                                    height: 12,
                                                                }}
                                                            />{" "}
                                                            {list.startTime}
                                                        </Typography>
                                                    </ListItem>
                                                )
                                            )}
                                    </List>
                                }
                                <Stack mt={2}>
                                    <Button
                                        onClick={() => handleOpen("consultation")}
                                        size="small"
                                        startIcon={<Add/>}>
                                        {t("add")}
                                    </Button>
                                </Stack>
                            </Stack>
                        )}
                    </CardContent>
                </ContentStyled>
            ) : id === 2 ? (
                <>
                    {patient?.requestedAnalyses.length === 0 && (
                        <ContentStyled>
                            <CardContent
                                style={{
                                    paddingBottom: "15px",
                                    fontSize: "0.75rem",
                                    color: "#7C878E",
                                    textAlign: "center",
                                    paddingTop: "15px",
                                }}>
                                {t("emptyBalance")}
                            </CardContent>
                        </ContentStyled>
                    )}
                    {patient?.requestedAnalyses.map((ra: any, index: number) => (
                        <ContentStyled key={index}>
                            <CardContent style={{paddingBottom: 5}}>
                                <p
                                    style={{
                                        textAlign: "right",
                                        textTransform: "capitalize",
                                        margin: "5px 15px",
                                        fontSize: 12,
                                        color: "#7C878E",
                                    }}>
                                    {moment(ra?.appointment, "DD-MM-YYYY").format("MMM DD/YYYY")}
                                </p>
                                <Stack spacing={2} alignItems="flex-start">
                                    <List dense>
                                        {ra.hasAnalysis.map((list: any, index: number) => (
                                            <ListItem key={index}>
                                                <ListItemIcon>
                                                    <CircleIcon/>
                                                </ListItemIcon>
                                                <Typography variant="body2" color="text.secondary">
                                                    {list.analysis.name}{" "}
                                                    {list.result ? "/" + list.result : ""}
                                                </Typography>
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            onClick={() => {
                                                setState(ra);
                                                handleOpen("balance_sheet_pending");
                                            }}
                                            size="small"
                                            startIcon={<Add/>}>
                                            {t("add_result")}
                                        </Button>
                                        {patient?.requestedAnalyses.length > 0 && (
                                            <Button
                                                color="error"
                                                size="small"
                                                onClick={() => {
                                                    setSelected({
                                                        title: t("askRemoveBilan"),
                                                        subtitle: t("subtitleRemoveBilan"),
                                                        icon: "/static/icons/ic-analyse.svg",
                                                        name1: t("balance_sheet_pending"),
                                                        name2: moment(ra?.appointment, "DD-MM-YYYY").format(
                                                            "MMM DD/YYYY"
                                                        ),
                                                        request: {
                                                            method: "DELETE",
                                                            url: `${urlMedicalEntitySuffix}/appointments/${router.query["uuid-consultation"]}/requested-analysis/${ra.uuid}/${router.locale}`,
                                                            headers: {
                                                                ContentType:
                                                                    "application/x-www-form-urlencoded",
                                                                Authorization: `Bearer ${session?.accessToken}`,
                                                            },
                                                        },
                                                    });
                                                    setOpenRemove(true);
                                                }}
                                                startIcon={<Icon path="setting/icdelete"/>}>
                                                {t("ignore")}
                                            </Button>
                                        )}
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </ContentStyled>
                    ))}
                </>
            ) : id === 9 ? (
                <>
                    {analyses.length === 0 && (
                        <ContentStyled>
                            <CardContent
                                style={{
                                    paddingBottom: "15px",
                                    fontSize: "0.75rem",
                                    color: "#7C878E",
                                    textAlign: "center",
                                    paddingTop: "15px",
                                }}>
                                {t("emptyBalance")}
                            </CardContent>
                        </ContentStyled>
                    )}
                    {analyses.map((ra: any, index: number) => (
                        <ContentStyled key={index}>
                            <CardContent style={{paddingBottom: 5}}>
                                <p
                                    style={{
                                        textAlign: "right",
                                        textTransform: "capitalize",
                                        margin: "5px 15px",
                                        fontSize: 12,
                                        color: "#7C878E",
                                    }}>
                                    {moment(ra?.appointment, "DD-MM-YYYY").format("MMM DD/YYYY")}
                                </p>
                                <Stack spacing={2} alignItems="flex-start">
                                    <List dense>
                                        {ra.hasAnalysis.map((list: any, index: number) => (
                                            <ListItem key={index}>
                                                <ListItemIcon>
                                                    <CircleIcon/>
                                                </ListItemIcon>
                                                <Typography variant="body2" color={list.result ? "" : "text.secondary"}>
                                                    {list.analysis.name}
                                                    {list.result ? " : " + list.result : ""}
                                                </Typography>
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            onClick={() => {
                                                setState(ra);
                                                handleOpen("balance_sheet_pending");
                                            }}
                                            size="small"
                                            startIcon={<Add/>}>
                                            {t("add_result")}
                                        </Button>
                                        {patient?.requestedAnalyses.length > 0 && (
                                            <Button
                                                color="error"
                                                size="small"
                                                onClick={() => {
                                                    setSelected({
                                                        title: t("askRemoveBilan"),
                                                        subtitle: t("subtitleRemoveBilan"),
                                                        icon: "/static/icons/ic-analyse.svg",
                                                        name1: t("balance_sheet_pending"),
                                                        name2: moment(ra?.appointment, "DD-MM-YYYY").format(
                                                            "MMM DD/YYYY"
                                                        ),
                                                        request: {
                                                            method: "DELETE",
                                                            url: `${urlMedicalEntitySuffix}/appointments/${router.query["uuid-consultation"]}/requested-analysis/${ra.uuid}/${router.locale}`,
                                                            headers: {
                                                                ContentType:
                                                                    "application/x-www-form-urlencoded",
                                                                Authorization: `Bearer ${session?.accessToken}`,
                                                            },
                                                        },
                                                    });
                                                    setOpenRemove(true);
                                                }}
                                                startIcon={<Icon path="setting/icdelete"/>}>
                                                {t("ignore")}
                                            </Button>
                                        )}
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </ContentStyled>
                    ))}
                </>
            ) : id === 6 ? (
                patient && (
                    <Antecedent
                        {...{
                            antecedent: "way_of_life",
                            patientAntecedents,
                            t,
                            patient,
                            trigger,
                            mutate: mutateInfo,
                            session,
                            setSelected,
                            setOpenRemove,
                            handleOpen,
                            router,
                            medical_entity
                        }}></Antecedent>
                )
            ) : id === 7 ? (
                patient && (
                    <Antecedent
                        {...{
                            antecedent: "allergic",
                            patientAntecedents,
                            t,
                            patient,
                            trigger,
                            mutate: mutateInfo,
                            session,
                            setSelected,
                            setOpenRemove,
                            handleOpen,
                            router,
                            medical_entity
                        }}
                    ></Antecedent>
                )
            ) : id === 5 ? (
                <>
                    {mi.length === 0 && (
                        <ContentStyled>
                            <CardContent
                                style={{
                                    paddingBottom: "15px",
                                    fontSize: "0.75rem",
                                    color: "#7C878E",
                                    textAlign: "center",
                                    paddingTop: "15px",
                                }}>
                                {t("emptyImaging")}
                            </CardContent>
                        </ContentStyled>
                    )}
                    {mi.map((ri: any, index: number) => (
                        <ContentStyled key={index}>
                            <CardContent style={{paddingBottom: 5}}>
                                <p
                                    style={{
                                        textAlign: "right",
                                        textTransform: "capitalize",
                                        margin: "5px 15px",
                                        fontSize: 12,
                                        color: "#7C878E",
                                    }}>
                                    {moment(ri?.appointment.dayDate, "DD-MM-YYYY").format(
                                        "MMM DD/YYYY"
                                    )}
                                </p>
                                <Stack spacing={2} alignItems="flex-start">
                                    <List dense>
                                        {ri["medical-imaging"]?.map((list: any, index: number) => (
                                            <ListItem key={index}>
                                                <ListItemIcon>
                                                    <CircleIcon/>
                                                </ListItemIcon>
                                                <Typography variant="body2" color="text.secondary">
                                                    {list["medical-imaging"]?.name}
                                                </Typography>
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            onClick={() => {
                                                setState(ri);
                                                handleOpen("medical_imaging_pending");
                                            }}
                                            size="small"
                                            startIcon={<Add/>}>
                                            {t("add_result")}
                                        </Button>
                                        {patient?.requestedImaging.length > 0 && (
                                            <Button
                                                color="error"
                                                size="small"
                                                onClick={() => {
                                                    setSelected({
                                                        title: t("askRemoveImg"),
                                                        subtitle: t("subtitleRemoveImg"),
                                                        icon: "/static/icons/ic-soura.svg",
                                                        name1: t("medical_imaging_pending"),
                                                        name2: moment(
                                                            ri?.appointment.dayDate,
                                                            "DD-MM-YYYY"
                                                        ).format("MMM DD/YYYY"),
                                                        request: {
                                                            method: "DELETE",
                                                            url: `${urlMedicalEntitySuffix}/appointment/${router.query["uuid-consultation"]}/medical-imaging/${ri.uuid}/${router.locale}`,
                                                            headers: {
                                                                ContentType:
                                                                    "application/x-www-form-urlencoded",
                                                                Authorization: `Bearer ${session?.accessToken}`,
                                                            },
                                                        },
                                                    });
                                                    setOpenRemove(true);
                                                }}
                                                startIcon={<Icon path="setting/icdelete"/>}>
                                                {t("ignore")}
                                            </Button>
                                        )}
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </ContentStyled>
                    ))}
                </>
            ) : id === 8 ? (
                <ContentStyled>
                    <CardContent style={{paddingBottom: 5}}>
                        {patientDocuments && patientDocuments.length > 0 && <Stack
                            spacing={2}
                            style={{overflowX: "auto", padding: 10, marginBottom: 5}}
                            direction={"row"}>
                            {patientDocuments.map((pdoc: any, idx: number) => (
                                <Stack key={`${idx}-item-doc-patient`} onClick={() => {
                                    showDoc(pdoc)
                                }}>
                                    <DocumentCard {...{t, data: pdoc, date: true, time: false, title: false}}/>
                                    <Typography whiteSpace={"nowrap"} fontSize={9} textAlign={"center"}
                                                style={{marginTop: 5, color: "grey", cursor: "pointer"}}>
                                        {moment(pdoc.createdAt, 'DD-MM-YYYY HH:mm').add(1, "hour").format('DD-MM-YYYY')}
                                    </Typography>
                                </Stack>
                            ))}
                        </Stack>}
                        {patientDocuments && patientDocuments.length === 0 && <Typography style={{
                            paddingBottom: "15px",
                            fontSize: "0.6rem",
                            color: "#7C878E",
                            textAlign: "center",
                            paddingTop: "15px",
                        }}>{t('emptydoc')}</Typography>}
                        <Button
                            onClick={() => {
                                dispatch(onOpenPatientDrawer({patientId: patient?.uuid}));
                                dispatch(setOpenUploadDialog(true))
                            }}
                            size="small"
                            style={{paddingBottom: pxToRem(0)}}
                            startIcon={<Add/>}>
                            {t("add")}
                        </Button>
                    </CardContent>
                </ContentStyled>
            ) : (
                patient && patientAntecedents &&
                allAntecedents.map(
                    (antecedent: { slug: string; }, index: number) =>
                        antecedent.slug && antecedent.slug !== "antecedents" && antecedent.slug !== "treatment" && antecedent.slug !== "way_of_life" &&
                        antecedent.slug !== "allergic" && (
                            <Antecedent
                                {...{
                                    antecedent: antecedent.slug,
                                    patientAntecedents,
                                    allAntecedents,
                                    t,
                                    patient,
                                    trigger,
                                    index,
                                    mutate: mutateInfo,
                                    session,
                                    setSelected,
                                    setOpenRemove,
                                    handleOpen: handleOpenDynamic,
                                    router,
                                    medical_entity
                                }}
                                key={`card-content-${antecedent}${index}`}></Antecedent>
                        )
                )
            )}

            <Dialog
                action={"remove"}
                direction={direction}
                open={openRemove}
                data={selected}
                color={(theme: Theme) => theme.palette.error.main}
                title={t("removedoc")}
                t={t}
                actionDialog={
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setOpenRemove(false);
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("cancel")}
                        </Button>
                        <LoadingButton
                            variant="contained"
                            sx={{
                                backgroundColor: (theme: Theme) => theme.palette.error.main,
                            }}
                            onClick={dialogSave}>
                            {t("remove")}
                        </LoadingButton>
                    </DialogActions>
                }
            />

            {info && (
                <Dialog
                    action={info}
                    open={openDialog}
                    data={{
                        state: state,
                        setState: setState,
                        patient_uuid: patient.uuid,
                        antecedents: allAntecedents,
                        action: infoDynamic,
                    }}
                    change={false}
                    max
                    size={size}
                    direction={direction}
                    actions={true}
                    title={getTitle()}
                    dialogClose={() => {
                        setOpenDialog(false);
                        setInfo("");
                        setInfoDynamic("");
                    }}
                    actionDialog={
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    setOpenDialog(false);
                                    setInfo("");
                                    setInfoDynamic("");
                                }}
                                startIcon={<CloseIcon/>}>
                                {t("cancel")}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleCloseDialog}
                                startIcon={<Icon path="ic-dowlaodfile"/>}>
                                {t("save")}
                            </Button>
                        </DialogActions>
                    }
                />
            )}

            <Dialog
                action={"document_detail"}
                open={openDialogDoc}
                data={{
                    state: document,
                    setState: setDocument,
                    setOpenDialog,
                    patient,
                    mutatePatientDocuments,
                    source: "patient",
                }}
                size={"lg"}
                direction={"ltr"}
                sx={{p: 0}}
                title={t("doc_detail_title")}
                onClose={handleCloseDialogDoc}
                dialogClose={handleCloseDialogDoc}
            />
        </React.Fragment>
    );
};
export default Content;
