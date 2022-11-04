import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import Icon from "@themes/urlIcon";
import { FormatterInput } from "@fullcalendar/common";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import AbsentIcon from "@themes/overrides/icons/absentIcon";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import CancelCircleIcon from "@themes/overrides/icons/cancelCircleIcon";
import React from "react";
import ConfirmCircleIcon from "@themes/overrides/icons/confirmCircleIcon";
import DefaultCircleIcon from "@themes/overrides/icons/defaultCircleIcon";
import FinishedCircleIcon from "@themes/overrides/icons/finishedCircleIcon";
import ExpiredCircleIcon from "@themes/overrides/icons/expiredCircleIcon";
import OnGogingCircleIcon from "@themes/overrides/icons/onGogingCircleIcon";
import NoShowCircleIcon from "@themes/overrides/icons/noShowCircleIcon";
import WaitingCircleIcon from "@themes/overrides/icons/waitingCircleIcon";

export const IconsTypes: any = {
  "ic-consultation": <EventOutlinedIcon />,
  "ic-teleconsultation": <VideocamOutlinedIcon />,
  "ic-control": <LocalHospitalOutlinedIcon />,
  "ic-clinique": <ApartmentOutlinedIcon />,
  "ic-at-home": <AddHomeOutlinedIcon />,
  "ic-medical-representative": <AbsentIcon />,
  "ic-staff-meeting": <AbsentIcon />,
  "ic-absence": <AbsentIcon />,
  "ic-personal": <FingerprintOutlinedIcon />,
};

export const AppointmentStatus: { [key: string]: AppointmentStatusModel } = {
  0: {
    key: "PENDING",
    value: "En attende",
    color: "#FFD400",
    classColor: "warning",
    icon: <DefaultCircleIcon />,
  },
  1: {
    key: "CONFIRMED",
    value: "Confirmé",
    color: "#1BC47D",
    classColor: "success",
    icon: <ConfirmCircleIcon />,
  },
  2: { key: "REFUSED", value: "Refusé", color: "#E83B68", classColor: "error" },
  3: {
    key: "WAITING_ROOM",
    value: "Salle d'attende",
    color: "#04618B",
    classColor: "back",
    icon: <WaitingCircleIcon />,
  },
  4: {
    key: "ON_GOING",
    value: "En consultation",
    color: "#1BC47D",
    classColor: "success",
    icon: <OnGogingCircleIcon />,
  },
  5: {
    key: "FINISHED",
    value: "Effectué",
    color: "#0096d6",
    classColor: "primary",
    icon: <FinishedCircleIcon />,
  },
  6: {
    key: "CANCELED",
    value: "Annulé",
    color: "#c92a2a",
    classColor: "error",
    icon: <CancelCircleIcon />,
  },
  7: {
    key: "EXPIRED",
    value: "Expiré",
    color: "#ff6600",
    classColor: "expire",
    icon: <ExpiredCircleIcon />,
  },
  8: { key: "PAUSED", value: "Pausé", color: "#ff6660", classColor: "warning" },
  9: {
    key: "DELETED",
    value: "Supprimé",
    color: "#E83B99",
    classColor: "error",
  },
  10: {
    key: "NOSHOW",
    value: "Raté",
    color: "#7C878E",
    classColor: "back",
    icon: <NoShowCircleIcon />,
  },
};

export const TableHead = [
  {
    id: "heure",
    label: "header.heure",
    align: "left",
    sortable: true,
  },
  {
    id: "motif",
    label: "header.motif",
    align: "left",
    sortable: true,
  },
  {
    id: "durée",
    label: "header.duree",
    align: "left",
    sortable: true,
  },
  {
    id: "status",
    label: "header.status",
    align: "center",
    sortable: true,
  },
  {
    id: "patient",
    label: "header.patient",
    align: "center",
    sortable: true,
  },
  {
    id: "agenda",
    label: "header.agenda",
    align: "center",
    sortable: true,
  },
  {
    id: "fees",
    label: "header.fees",
    align: "right",
    sortable: true,
  },
  {
    id: "action",
    label: "header.action",
    align: "right",
    sortable: false,
  },
];

export const DayOfWeek = (day: string, start = 1) => {
  const days: { [key: string]: number } = {
    FRI: 5,
    MON: 1,
    SAT: 6,
    SUN: start === 1 ? 7 : 0,
    THU: 4,
    TUE: 2,
    WED: 3,
  };
  return days[day];
};

export const AddAppointmentCardData = {
  mainIcon: "ic-agenda-+",
  title: "table.no-data.event.title",
  description: "table.no-data.event.description",
  buttonText: "table.no-data.event.button-text",
  buttonIcon: "ic-agenda-+",
  buttonVariant: "warning",
};

export const SlotFormat = {
  hour: "numeric",
  minute: "2-digit",
  omitZeroMinute: false,
  hour12: false,
} as FormatterInput;

export const CalendarContextMenu = [
  {
    title: "start_the_consultation",
    icon: <PlayCircleIcon />,
    action: "onConsultationDetail",
  },
  {
    title: "view_the_consultation",
    icon: <PlayCircleIcon />,
    action: "onConsultationView",
  },
  {
    title: "add_patient_to_waiting_room",
    icon: <Icon color={"white"} path="ic-salle" />,
    action: "onWaitingRoom",
  },
  {
    title: "patient_no_show",
    icon: <Icon color={"white"} width={"18"} height={"18"} path="ic-user1" />,
    action: "onPatientNoShow",
  },
  {
    title: "leave_waiting_room",
    icon: <Icon color={"white"} path="ic-salle" />,
    action: "onLeaveWaitingRoom",
  },
  {
    title: "see_patient_form",
    icon: (
      <Icon color={"white"} width={"18"} height={"18"} path="ic-edit-file" />
    ),
    action: "onPatientDetail",
  },
  {
    title: "reschedule_appointment",
    icon: <Icon color={"white"} width={"16"} height={"16"} path="ic-agenda" />,
    action: "onReschedule",
  },
  {
    title: "move_appointment",
    icon: <Icon color={"white"} path="iconfinder" />,
    action: "onMove",
  },
  {
    title: "cancel_appointment",
    icon: <Icon color={"white"} width={"18"} height={"18"} path="close" />,
    action: "onCancel",
  },
  {
    title: "delete_appointment",
    icon: <Icon color={"white"} width={"18"} height={"18"} path="icdelete" />,
    action: "onDelete",
  }
];
