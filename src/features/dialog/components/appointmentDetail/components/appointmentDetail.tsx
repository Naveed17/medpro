import React, { ReactElement, useEffect, useRef, useState } from "react";
import RootStyled from "./overrides/rootStyled";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Stack,
  InputAdornment,
  CardActions,
  Typography,
  Card,
  CardContent,
  Avatar,
  Link,
  TextField,
  List,
  ListItem,
  useTheme,
} from "@mui/material";

import { AppointmentCard } from "@features/card";
import IconUrl from "@themes/urlIcon";
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";
import CloseIcon from "@mui/icons-material/Close";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { useAppDispatch, useAppSelector } from "@app/redux/hooks";
import { agendaSelector, openDrawer } from "@features/calendar";

import { Dialog, QrCodeDialog, setMoveDateTime } from "@features/dialog";
import { useTranslation } from "next-i18next";
import { useRequest, useRequestMutation } from "@app/axios";
import {
  SWRNoValidateConfig,
  TriggerWithoutValidation,
} from "@app/swr/swrProvider";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import CircularProgress from "@mui/material/CircularProgress";
import { LoadingButton } from "@mui/lab";
import { LoadingScreen } from "@features/loadingScreen";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { countries as dialCountries } from "@features/countrySelect/countries";
import { EventDef } from "@fullcalendar/react";

function AppointmentDetail({ ...props }) {
  const {
    OnConsultation,
    OnConsultationView,
    OnEditDetail,
    OnConfirmAppointment,
    OnDataUpdated = null,
    OnPatientNoShow,
    OnWaiting,
    OnLeaveWaiting,
    SetMoveDialog,
    SetCancelDialog,
    SetDeleteDialog,
  } = props;

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const { data: user } = session as Session;
  const medical_entity = (user as UserDataResponse)
    .medical_entity as MedicalEntityModel;
  const roles = (session?.data as UserDataResponse).general_information
    .roles as Array<string>;

  const { t, ready } = useTranslation("common");
  const { config: agendaConfig, selectedEvent: appointment } =
    useAppSelector(agendaSelector);

  const { trigger: updateInstructionTrigger } = useRequestMutation(
    null,
    "/agenda/update/instruction",
    TriggerWithoutValidation
  );

  const { data: httpPatientPhotoResponse, mutate: mutatePatientPhoto } =
    useRequest(
      appointment?.extendedProps?.patient?.hasPhoto
        ? {
            method: "GET",
            url: `/api/medical-entity/${medical_entity?.uuid}/patients/${appointment.extendedProps.patient?.uuid}/documents/profile-photo/${router.locale}`,
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        : null,
      SWRNoValidateConfig
    );

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [instruction, setInstruction] = useState(
    appointment?.extendedProps?.instruction
      ? appointment?.extendedProps?.instruction
      : ""
  );
  const [edited, setEdited] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateInstruction = () => {
    setLoading(true);
    const form = new FormData();
    form.append("attribute", "instruction");
    form.append("value", instruction);
    updateInstructionTrigger({
      method: "PATCH",
      url: `/api/medical-entity/${medical_entity.uuid}/agendas/${
        agendaConfig?.uuid
      }/appointments/${
        appointment?.publicId ? appointment?.publicId : (appointment as any)?.id
      }/${router.locale}`,
      data: form,
      headers: { Authorization: `Bearer ${session?.accessToken}` },
    }).then(() => {
      setLoading(false);
      setEdited(false);
      if (OnDataUpdated) {
        OnDataUpdated();
      }
    });
  };

  const handleQr = () => {
    handleClickDialog();
  };

  const handleClickDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getCountryByCode = (code: string) => {
    return dialCountries.find((country) => country.phone === code);
  };

  const getBirthdayFormat = (patient: PatientModel) => {
    const birthday = moment().preciseDiff(
      moment(patient?.birthdate, "DD-MM-YYYY"),
      true
    );
    return `${
      birthday.years
        ? `${birthday.years} ${t("times.years").toLowerCase()}, `
        : ""
    } ${
      birthday.months
        ? `${birthday.months} ${t("times.months").toLowerCase()}, `
        : ""
    } ${
      birthday.days ? `${birthday.days} ${t("times.days").toLowerCase()}` : ""
    }`;
  };

  const patientPhoto = (httpPatientPhotoResponse as HttpResponse)?.data.photo;

  useEffect(() => {
    if (appointment && appointment.extendedProps.photo) {
      mutatePatientPhoto();
    }
  }, [appointment]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready)
    return (
      <LoadingScreen
        error
        button={"loading-error-404-reset"}
        text={"loading-error"}
      />
    );

  return (
    <RootStyled>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <IconButton
            disableRipple
            size="medium"
            edge="end"
            onClick={() => dispatch(openDrawer({ type: "view", open: false }))}>
            <Icon path="ic-x" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        ref={rootRef}
        sx={{
          height: "calc(100% - 64px)",
          overflowY: "scroll",
        }}>
        <Box px={1} py={2}>
          <Stack
            spacing={2}
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            <Typography variant="h6">{t("appointment_details")}</Typography>
            {!roles.includes("ROLE_SECRETARY") &&
              router.pathname !== "/dashboard/patient" && (
                <LoadingButton
                  {...{ loading }}
                  loadingPosition="start"
                  variant="contained"
                  color="warning"
                  startIcon={<PlayCircleIcon />}
                  onClick={() => {
                    setLoading(true);
                    ["FINISHED", "ON_GOING"].includes(
                      appointment?.extendedProps.status.key
                    )
                      ? OnConsultationView(appointment)
                      : OnConsultation(appointment);
                  }}>
                  {t(
                    ["FINISHED", "ON_GOING"].includes(
                      appointment?.extendedProps.status.key
                    )
                      ? "view_the_consultation"
                      : "event.start"
                  )}
                </LoadingButton>
              )}
          </Stack>
          {appointment?.extendedProps.hasErrors?.map(
            (error: string, index: number) => (
              <Stack
                key={`error${index}`}
                sx={{ mt: 2 }}
                spacing={2}
                direction="row"
                justifyContent="space-between"
                alignItems="center">
                <Typography variant="body2" component="span" className="alert">
                  <Icon path="danger" />
                  <span>{t(error)}</span>
                </Typography>
              </Stack>
            )
          )}

          <Typography sx={{ mt: 2, mb: 1 }} variant="body1" fontWeight={600}>
            {t("patient")}
          </Typography>
          <Card>
            <CardContent>
              <Stack
                spacing={2}
                direction="row"
                justifyContent="space-between"
                alignItems="center">
                <Stack spacing={2} direction="row" alignItems="center">
                  <Avatar
                    src={
                      patientPhoto
                        ? patientPhoto
                        : appointment?.extendedProps?.patient?.gender === "M"
                        ? "/static/icons/men-avatar.svg"
                        : "/static/icons/women-avatar.svg"
                    }
                    sx={{
                      "& .injected-svg": {
                        margin: 0,
                      },
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                    }}>
                    <IconUrl width={"24"} height={"24"} path="men-avatar" />
                  </Avatar>
                  <Typography
                    className={"user-name"}
                    variant="body1"
                    color="primary"
                    fontWeight={700}>
                    {appointment?.title}
                  </Typography>
                </Stack>
                <IconButton size="small" onClick={OnEditDetail}>
                  <IconUrl path="ic-duotone" />
                </IconButton>
              </Stack>
              <List sx={{ py: 0, pl: 2 }}>
                {appointment?.extendedProps.patient?.birthdate && (
                  <ListItem>
                    <IconUrl path="ic-anniverssaire" />
                    <Typography
                      sx={{ ml: 1, fontSize: 11 }}
                      variant="caption"
                      color="text.secondary"
                      fontWeight={400}>
                      {appointment?.extendedProps.patient?.birthdate} ({" "}
                      {getBirthdayFormat(appointment?.extendedProps.patient)} )
                    </Typography>
                  </ListItem>
                )}
                {appointment?.extendedProps.patient.email && (
                  <ListItem>
                    <IconUrl path="ic-message-contour" />
                    <Link
                      underline="none"
                      href={`mailto:${appointment?.extendedProps.patient.email}`}
                      sx={{ ml: 1, fontSize: 11 }}
                      variant="caption"
                      color="primary"
                      fontWeight={400}>
                      {appointment?.extendedProps.patient.email}
                    </Link>
                  </ListItem>
                )}
                {appointment?.extendedProps.patient.contact.length > 0 && (
                  <ListItem>
                    <IconUrl path="ic-tel" />
                    {appointment?.extendedProps.patient.contact[0].code && (
                      <Avatar
                        sx={{
                          width: 18,
                          height: 14,
                          borderRadius: 0.4,
                          ml: ".5rem",
                        }}
                        alt="flag"
                        src={`https://flagcdn.com/${getCountryByCode(
                          appointment?.extendedProps.patient.contact[0].code
                        )?.code.toLowerCase()}.svg`}
                      />
                    )}
                    <Link
                      underline="none"
                      href={`tel:${appointment?.extendedProps.patient.contact[0].code}${appointment?.extendedProps.patient.contact[0].value}`}
                      sx={{ ml: 1, fontSize: 11 }}
                      variant="caption"
                      color="text.secondary"
                      fontWeight={400}>
                      <Stack direction={"row"} alignItems={"center"}>
                        {appointment?.extendedProps.patient.contact[0].value}
                        <KeyboardArrowRightRoundedIcon
                          color={"disabled"}
                          fontSize={"small"}
                        />
                      </Stack>
                    </Link>
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          <Typography
            sx={{
              mb: 1,
              mt: appointment?.extendedProps.hasErrors?.length > 1 ? 0 : 2,
            }}
            variant="body1"
            fontWeight={600}>
            {t("time_slot")}
          </Typography>
          <AppointmentCard
            {...{ t, roles }}
            onDataUpdated={OnDataUpdated}
            data={{
              uuid: appointment?.publicId
                ? appointment?.publicId
                : (appointment as any)?.id,
              date: moment(appointment?.extendedProps.time).format(
                "DD-MM-YYYY"
              ),
              time: moment(appointment?.extendedProps.time).format("HH:mm"),
              motif: appointment?.extendedProps.motif,
              status: appointment?.extendedProps.status,
              type: appointment?.extendedProps.type,
            }}
          />

          {process.env.NODE_ENV === "development" && (
            <Stack direction="row" spacing={2} alignItems="center" mt={2}>
              <Button onClick={handleQr} variant="contained" fullWidth>
                Qr-Code
              </Button>
              <Button variant="contained" fullWidth>
                {t("send_link")}
              </Button>
            </Stack>
          )}

          <Typography sx={{ mt: 2, mb: 1 }} variant="body1" fontWeight={600}>
            {t("insctruction")}
          </Typography>
          <Card>
            <CardContent>
              <TextField
                id="outlined-multiline-static"
                placeholder={t("insctruction")}
                multiline
                rows={4}
                disabled={!edited}
                value={instruction}
                fullWidth
                onChange={(e) => setInstruction(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      onClick={() =>
                        edited ? updateInstruction() : setEdited(true)
                      }
                      position="end">
                      {edited ? (
                        loading ? (
                          <IconButton size="small">
                            <CircularProgress size={20} />{" "}
                          </IconButton>
                        ) : (
                          <>
                            <Button
                              sx={{
                                marginRight: 1,
                              }}
                              onClick={(event) => {
                                event.stopPropagation();
                                setEdited(false);
                              }}
                              color={"error"}
                              variant="outlined"
                              size="small">
                              {t("event.cancel").split(" ")[0]}
                            </Button>
                            <Button
                              disabled={edited && instruction.length === 0}
                              variant="outlined"
                              startIcon={<SaveAsIcon color={"inherit"} />}
                              size="small">
                              {t("event.save")}
                            </Button>
                          </>
                        )
                      ) : (
                        <IconButton size="small">
                          <IconUrl path="ic-duotone" />{" "}
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </CardContent>
          </Card>
        </Box>
        {router.pathname !== "/dashboard/patient" && (
          <CardActions sx={{ pb: 4 }}>
            <Stack spacing={1} width={1}>
              <LoadingButton
                {...{ loading }}
                sx={{
                  display:
                    appointment?.extendedProps.status.key !== "PENDING"
                      ? "none"
                      : "flex",
                }}
                onClick={() => {
                  OnConfirmAppointment(appointment);
                }}
                color={"success"}
                fullWidth
                variant="contained"
                startIcon={<CheckCircleOutlineRoundedIcon />}>
                {t("event.confirm")}
              </LoadingButton>
              <LoadingButton
                {...{ loading }}
                onClick={() => OnWaiting(appointment)}
                sx={{
                  display:
                    moment().format("DD-MM-YYYY") !==
                      moment(appointment?.extendedProps.time).format(
                        "DD-MM-YYYY"
                      ) ||
                    ["PENDING", "WAITING_ROOM", "ON_GOING"].includes(
                      appointment?.extendedProps.status.key
                    )
                      ? "none"
                      : "flex",
                }}
                fullWidth
                variant="contained"
                startIcon={<Icon path="ic-salle" />}>
                {t("waiting")}
              </LoadingButton>
              <LoadingButton
                {...{ loading }}
                onClick={() => OnLeaveWaiting(appointment)}
                sx={{
                  display:
                    moment().format("DD-MM-YYYY") !==
                      moment(appointment?.extendedProps.time).format(
                        "DD-MM-YYYY"
                      ) ||
                    appointment?.extendedProps.status.key !== "WAITING_ROOM"
                      ? "none"
                      : "flex",
                }}
                fullWidth
                variant="contained"
                startIcon={<Icon path="ic-salle" />}>
                {t("leave_waiting_room")}
              </LoadingButton>
              <LoadingButton
                {...{ loading }}
                sx={{
                  display:
                    moment().isBefore(appointment?.extendedProps.time) ||
                    appointment?.extendedProps.status.key === "FINISHED" ||
                    appointment?.extendedProps.status.key === "ON_GOING"
                      ? "none"
                      : "flex",
                }}
                onClick={() => OnPatientNoShow(appointment)}
                fullWidth
                variant="contained"
                startIcon={
                  <IconUrl width={"16"} height={"16"} path="ic-user1" />
                }>
                {t("event.missPatient")}
              </LoadingButton>
              <LoadingButton
                {...{ loading }}
                sx={{
                  display:
                    appointment?.extendedProps.status.key !== "FINISHED"
                      ? "none"
                      : "flex",
                }}
                onClick={() => {
                  dispatch(
                    setMoveDateTime({
                      date: new Date(appointment?.extendedProps.time),
                      time: moment(
                        new Date(appointment?.extendedProps.time)
                      ).format("HH:mm"),
                      action: "reschedule",
                      selected: false,
                    })
                  );
                  SetMoveDialog(true);
                }}
                fullWidth
                variant="contained"
                startIcon={
                  <IconUrl width={"16"} height={"16"} path="ic-agenda" />
                }>
                {t("event.reschedule")}
              </LoadingButton>
              <LoadingButton
                {...{ loading }}
                sx={{
                  display:
                    moment().isAfter(appointment?.extendedProps.time) ||
                    appointment?.extendedProps.status.key === "FINISHED"
                      ? "none"
                      : "flex",
                }}
                onClick={() => {
                  dispatch(
                    setMoveDateTime({
                      date: new Date(appointment?.extendedProps.time),
                      time: moment(
                        new Date(appointment?.extendedProps.time)
                      ).format("HH:mm"),
                      action: "move",
                      selected: false,
                    })
                  );
                  SetMoveDialog(true);
                }}
                fullWidth
                variant="contained"
                startIcon={<IconUrl path="iconfinder" />}>
                {t("event.move")}
              </LoadingButton>
              <LoadingButton
                {...{ loading }}
                onClick={() => SetCancelDialog(true)}
                fullWidth
                variant="contained-white"
                color="error"
                sx={{
                  display:
                    appointment?.extendedProps.status.key === "CANCELED" ||
                    appointment?.extendedProps.status.key === "FINISHED" ||
                    appointment?.extendedProps.status.key === "ON_GOING"
                      ? "none"
                      : "flex",
                  "& svg": {
                    width: 16,
                    height: 16,
                  },
                }}
                startIcon={
                  <IconUrl
                    path="icdelete"
                    color={
                      appointment?.extendedProps.status.key === "CANCELED"
                        ? "white"
                        : theme.palette.error.main
                    }
                  />
                }>
                {t("event.cancel")}
              </LoadingButton>
              <LoadingButton
                {...{ loading }}
                onClick={() => SetDeleteDialog(true)}
                sx={{
                  display:
                    appointment?.extendedProps.status.key === "CANCELED" ||
                    appointment?.extendedProps.status.key === "FINISHED" ||
                    appointment?.extendedProps.status.key === "ON_GOING"
                      ? "none"
                      : "flex",
                }}
                fullWidth
                variant="contained-white"
                color="error"
                startIcon={<HighlightOffRoundedIcon color={"error"} />}>
                {t("event.delete")}
              </LoadingButton>
            </Stack>
          </CardActions>
        )}
      </Box>

      <Dialog
        action={() => <QrCodeDialog data={appointment} />}
        open={openDialog}
        onClose={handleCloseDialog}
        direction={"ltr"}
        title={t("qr_title")}
        dialogClose={handleCloseDialog}
      />
    </RootStyled>
  );
}

export default AppointmentDetail;
