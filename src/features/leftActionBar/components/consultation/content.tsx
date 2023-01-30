// components
import {
  Button,
  CardContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Theme,
} from "@mui/material";
import Icon from "@themes/urlIcon";
import IconUrl from "@themes/urlIcon";
import { useTranslation } from "next-i18next";
import ContentStyled from "./overrides/contantStyle";
import CircleIcon from "@mui/icons-material/Circle";
import { Dialog } from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import Add from "@mui/icons-material/Add";
import { useAppDispatch, useAppSelector } from "@app/redux/hooks";
import { openDrawer } from "@features/calendar";
import { pxToRem } from "@themes/formatFontSize";
import { consultationSelector } from "@features/toolbar/components/consultationIPToolbar/selectors";
import { useRequest, useRequestMutation } from "@app/axios";
import { useRouter } from "next/router";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { resetAppointment, setAppointmentPatient } from "@features/tabPanel";
import moment from "moment/moment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { SetSelectedApp } from "@features/toolbar";
import Antecedent from "@features/leftActionBar/components/consultation/antecedent";
import { LoadingScreen } from "@features/loadingScreen";
import { Theme } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { configSelector } from "@features/base";
import Image from "next/image";

const Content = ({ ...props }) => {
  const { id, patient, onClose } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t, ready } = useTranslation("consultation", { keyPrefix: "filter" });
  const dispatch = useAppDispatch();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [info, setInfo] = useState<string>("");
  const [size, setSize] = useState<string>("sm");
  const bigDialogs = ["add_treatment"];
  const [state, setState] = useState<
    AntecedentsModel[] | FamilyAntecedentsModel[]
  >([]);
  const { mutate, mutateDoc } = useAppSelector(consultationSelector);
  const { trigger } = useRequestMutation(null, "/antecedent");
  const router = useRouter();
  const [selected, setSelected] = useState<any>();
  const [openRemove, setOpenRemove] = useState(false);
  const { data: session, status } = useSession();
  const { direction } = useAppSelector(configSelector);
  const { data: user } = session as Session;
  const medical_entity = (user as UserDataResponse)
    .medical_entity as MedicalEntityModel;
  const [document, setDocument] = useState<any>();
  const [openDialogDoc, setOpenDialogDoc] = useState<boolean>(false);

  const codes: any = {
    way_of_life: "0",
    allergic: "1",
    treatment: "2",
    antecedents: "3",
    family_antecedents: "4",
    surgical_antecedents: "5",
    medical_antecedents: "6",
  };
  const handleClickDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialogDoc = () => {
    setOpenDialogDoc(false);
  };
  const handleCloseDialog = () => {
    const form = new FormData();
    if (codes[info]) {
      form.append("antecedents", JSON.stringify(state));
      form.append("patient_uuid", patient.uuid);
      trigger(
        {
          method: "POST",
          url: `/api/medical-entity/${medical_entity.uuid}/patients/${patient.uuid}/antecedents/${codes[info]}/${router.locale}`,
          data: form,
          headers: {
            ContentType: "multipart/form-data",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        },
        { revalidate: true, populateCache: true }
      ).then(() => {
        mutate();
      });
    } else if (info === "add_treatment") {
      form.append("globalNote", "");
      form.append("isOtherProfessional", "true");
      form.append("drugs", JSON.stringify(state));

      trigger(
        {
          method: "POST",
          url: `/api/medical-entity/${medical_entity.uuid}/appointments/${router.query["uuid-consultation"]}/prescriptions/${router.locale}`,
          data: form,
          headers: {
            ContentType: "application/x-www-form-urlencoded",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        },
        { revalidate: true, populateCache: true }
      ).then(() => {
        mutate();
      });
    } else if (info === "balance_sheet_pending") {
      form.append("analysesResult", JSON.stringify((state as any).hasAnalysis));

      trigger(
        {
          method: "PUT",
          url: `/api/medical-entity/${medical_entity.uuid}/appointments/${
            router.query["uuid-consultation"]
          }/requested-analysis/${(state as any).uuid}/${router.locale}`,
          data: form,
          headers: {
            ContentType: "application/x-www-form-urlencoded",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        },
        { revalidate: true, populateCache: true }
      ).then(() => {
        mutate();
      });
    } else if (info === "medical_imaging_pending") {
      mutate();
      mutateDoc();
    }

    setOpenDialog(false);
    setInfo("");
  };

  const dialogSave = () => {
    trigger(selected.request, { revalidate: true, populateCache: true }).then(
      () => {
        mutate();
      }
    );
    setOpenRemove(false);
  };

  const handleOpen = (action: string) => {
    if (action === "consultation") {
      dispatch(resetAppointment());
      dispatch(setAppointmentPatient(patient));
      dispatch(openDrawer({ type: "add", open: true }));
      if (isMobile) {
        onClose();
      }
      return;
    }

    if (patient.antecedents[action]) setState(patient.antecedents[action]);

    setInfo(action);
    bigDialogs.includes(action) ? setSize("lg") : setSize("sm");

    handleClickDialog();
  };

  const showDoc = (card: any) => {
    if (card.documentType === "medical-certificate") {
      setOpenDialogDoc(true);
      setDocument({
        uuid: card.uuid,
        content: card.certificate[0].content,
        doctor: card.name,
        patient: `${patient.firstName} ${patient.lastName}`,
        days: card.days,
        description: card.description,
        createdAt: card.createdAt,
        name: "certif",
        type: "write_certif",
        mutate: mutatePatientDocuments(),
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
          break;
        case "requested-medical-imaging":
          info = card.medical_imaging[0]["medical-imaging"];
          break;
      }
      setDocument({
        uuid: card.uuid,
        uri: card.uri,
        name: card.title,
        type: card.documentType,
        info: info,
        uuidDoc: uuidDoc,
        description: card.description,
        createdAt: card.createdAt,
        patient: patient.firstName + " " + patient.lastName,
        mutate: mutatePatientDocuments,
      });
      setOpenDialogDoc(true);
    }
  };

  const { data: httpPatientDocumentsResponse, mutate: mutatePatientDocuments } =
    useRequest(
      patient
        ? {
            method: "GET",
            url: `/api/medical-entity/${medical_entity?.uuid}/patients/${patient.uuid}/documents/${router.locale}`,
            headers: { Authorization: `Bearer ${session?.accessToken}` },
          }
        : null
    );

  const patientDocuments = (httpPatientDocumentsResponse as HttpResponse)?.data;

  if (!ready || status === "loading")
    return (
      <LoadingScreen
        error
        button={"loading-error-404-reset"}
        text={"loading-error"}
      />
    );

  return (
    <React.Fragment>
      {id === 1 || id === 3 ? (
        <ContentStyled>
          <CardContent style={{ paddingBottom: pxToRem(15) }}>
            {id === 1 && (
              <Stack spacing={1} alignItems="flex-start">
                <List dense>
                  {patient?.treatment
                    .filter((tr: any) => tr.isOtherProfessional)
                    .map((list: any, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CircleIcon />
                        </ListItemIcon>
                        <Typography variant="body2" color={"text.secondary"}>
                          {list.name} / {list.duration} {t(list.durationType)}{" "}
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
                                url: `/api/medical-entity/${medical_entity.uuid}/appointments/${router.query["uuid-consultation"]}/prescription-has-drugs/${list.uuid}/${router.locale}`,
                                headers: {
                                  ContentType:
                                    "application/x-www-form-urlencoded",
                                  Authorization: `Bearer ${session?.accessToken}`,
                                },
                              },
                            });
                            setOpenRemove(true);
                          }}
                          sx={{ ml: "auto" }}>
                          <Icon path="setting/icdelete" />
                        </IconButton>
                      </ListItem>
                    ))}

                  {patient?.treatment.filter(
                    (tr: any) => !tr.isOtherProfessional
                  ).length > 0 && (
                    <Typography fontSize={11} fontWeight={"bold"} mt={1}>
                      {t("prescription")}
                    </Typography>
                  )}
                  {patient?.treatment
                    .filter((tr: any) => !tr.isOtherProfessional)
                    .map((list: any, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CircleIcon />
                        </ListItemIcon>
                        <Typography variant="body2">
                          {list.name} / {list.duration} {t(list.durationType)}{" "}
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
                                url: `/api/medical-entity/${medical_entity.uuid}/appointments/${router.query["uuid-consultation"]}/prescription-has-drugs/${list.uuid}/${router.locale}`,
                                headers: {
                                  ContentType:
                                    "application/x-www-form-urlencoded",
                                  Authorization: `Bearer ${session?.accessToken}`,
                                },
                              },
                            });
                            setOpenRemove(true);
                          }}
                          sx={{ ml: "auto" }}>
                          <Icon path="setting/icdelete" />
                        </IconButton>
                      </ListItem>
                    ))}
                </List>
                <Button
                  onClick={() => handleOpen("add_treatment")}
                  size="small"
                  style={{ paddingBottom: pxToRem(0) }}
                  startIcon={<Add />}>
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
                              <CircleIcon />
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
                    startIcon={<Add />}>
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
              <CardContent style={{ paddingBottom: 5 }}>
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
                          <CircleIcon />
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
                      startIcon={<Add />}>
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
                              url: `/api/medical-entity/${medical_entity.uuid}/appointments/${router.query["uuid-consultation"]}/requested-analysis/${ra.uuid}/${router.locale}`,
                              headers: {
                                ContentType:
                                  "application/x-www-form-urlencoded",
                                Authorization: `Bearer ${session?.accessToken}`,
                              },
                            },
                          });
                          setOpenRemove(true);
                        }}
                        startIcon={<Icon path="setting/icdelete" />}>
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
            antecedent={"way_of_life"}
            t={t}
            patient={patient}
            trigger={trigger}
            mutate={mutate}
            setSelected={setSelected}
            setOpenRemove={setOpenRemove}
            session={session}
            handleOpen={handleOpen}
            router={router}
            medical_entity={medical_entity}></Antecedent>
        )
      ) : id === 7 ? (
        patient && (
          <Antecedent
            antecedent={"allergic"}
            t={t}
            patient={patient}
            trigger={trigger}
            mutate={mutate}
            session={session}
            setSelected={setSelected}
            setOpenRemove={setOpenRemove}
            handleOpen={handleOpen}
            router={router}
            medical_entity={medical_entity}></Antecedent>
        )
      ) : id === 5 ? (
        <>
          {patient?.requestedImaging.length === 0 && (
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
          {patient?.requestedImaging.map((ri: any, index: number) => (
            <ContentStyled key={index}>
              <CardContent style={{ paddingBottom: 5 }}>
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
                    {ri["medical-imaging"].map((list: any, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CircleIcon />
                        </ListItemIcon>
                        <Typography variant="body2" color="text.secondary">
                          {list["medical-imaging"].name}
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
                      startIcon={<Add />}>
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
                              url: `/api/medical-entity/${medical_entity.uuid}/appointment/${router.query["uuid-consultation"]}/medical-imaging/${ri.uuid}/${router.locale}`,
                              headers: {
                                ContentType:
                                  "application/x-www-form-urlencoded",
                                Authorization: `Bearer ${session?.accessToken}`,
                              },
                            },
                          });
                          setOpenRemove(true);
                        }}
                        startIcon={<Icon path="setting/icdelete" />}>
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
        <>
          {patientDocuments &&
            patientDocuments.map((pdoc: any, idx: number) => (
              <Stack
                spacing={2}
                direction={"row"}
                alignItems={"center"}
                key={`doc-patient-${idx}`}
                pl={2}
                onClick={() => {
                  showDoc(pdoc);
                }}>
                {pdoc.documentType !== "photo" && (
                  <IconUrl
                    width={25}
                    height={25}
                    path={
                      (pdoc.documentType === "prescription" &&
                        "ic-traitement") ||
                      (pdoc.documentType == "requested-analysis" &&
                        "ic-analyse") ||
                      (pdoc.documentType == "analyse" && "ic-analyse") ||
                      (pdoc.documentType == "medical-imaging" && "ic-soura") ||
                      (pdoc.documentType == "requested-medical-imaging" &&
                        "ic-soura") ||
                      (pdoc.documentType === "photo" && "ic-img") ||
                      (pdoc.documentType === "audio" && "ic-son") ||
                      (pdoc.documentType === "Rapport" && "ic-text") ||
                      (pdoc.documentType === "medical-certificate" &&
                        "ic-text") ||
                      (pdoc.documentType === "video" && "ic-video-outline") ||
                      (pdoc.documentType !== "prescription" && "ic-pdf") ||
                      ""
                    }
                  />
                )}

                {pdoc.documentType === "photo" && (
                  <Image
                    width={30}
                    height={30}
                    src={pdoc.uri}
                    style={{ borderRadius: 5 }}
                    alt={"photo history"}
                  />
                )}

                <ListItemText
                  primary={pdoc.title}
                  sx={{ cursor: "pointer" }}
                  secondary={t(pdoc.documentType)}
                />
              </Stack>
            ))}
        </>
      ) : (
        patient &&
        Object.keys(patient.antecedents).map(
          (antecedent, index) =>
            antecedent !== "way_of_life" &&
            antecedent !== "allergic" && (
              <Antecedent
                antecedent={antecedent}
                t={t}
                patient={patient}
                trigger={trigger}
                mutate={mutate}
                session={session}
                index={index}
                setSelected={setSelected}
                setOpenRemove={setOpenRemove}
                key={`card-content-${antecedent}${index}`}
                handleOpen={handleOpen}
                router={router}
                medical_entity={medical_entity}></Antecedent>
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
              startIcon={<CloseIcon />}>
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
            action: info,
          }}
          change={false}
          max
          size={size}
          direction={direction}
          actions={true}
          title={t(info)}
          dialogClose={() => {
            setOpenDialog(false);
            setInfo("");
          }}
          actionDialog={
            <DialogActions>
              <Button
                onClick={() => {
                  setOpenDialog(false);
                  setInfo("");
                }}
                startIcon={<CloseIcon />}>
                {t("cancel")}
              </Button>
              <Button
                variant="contained"
                onClick={handleCloseDialog}
                startIcon={<Icon path="ic-dowlaodfile" />}>
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
        sx={{ p: 0 }}
        title={t("doc_detail_title")}
        onClose={handleCloseDialogDoc}
        dialogClose={handleCloseDialogDoc}
      />
    </React.Fragment>
  );
};
export default Content;
