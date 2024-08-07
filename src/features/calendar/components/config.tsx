import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import Icon from "@themes/urlIcon";
import {FormatterInput} from "@fullcalendar/core";
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
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import PersonOffIcon from '@mui/icons-material/PersonOffRounded';
import {Avatar} from "@mui/material";
import PauseIcon from "@themes/overrides/icons/pauseIcon";
import CancelAppointmentPatientIcon from "@themes/overrides/icons/cancelAppointmentPatientIcon";
import IconUrl from "@themes/urlIcon";

export const IconsTypes: any = {
    "ic-consultation": <EventOutlinedIcon/>,
    "ic-teleconsultation": <VideocamOutlinedIcon/>,
    "ic-control": <LocalHospitalOutlinedIcon/>,
    "ic-clinique": <ApartmentOutlinedIcon/>,
    "ic-at-home": <AddHomeOutlinedIcon/>,
    "ic-medical-representative": <AbsentIcon/>,
    "ic-staff-meeting": <AbsentIcon/>,
    "ic-absence": <AbsentIcon/>,
    "ic-personal": <FingerprintOutlinedIcon/>,
};

export const AppointmentStatus: { [key: string]: AppointmentStatusModel } = {
    0: {
        key: "PENDING",
        value: "En attente",
        color: "#FFD400",
        classColor: "warning",
        icon: <DefaultCircleIcon/>,
    },
    1: {
        key: "CONFIRMED",
        value: "Confirmé",
        color: "#1BC47D",
        classColor: "success",
        icon: <ConfirmCircleIcon/>,
    },
    2: {key: "REFUSED", value: "Refusé", color: "#E83B68", classColor: "error"},
    3: {
        key: "WAITING_ROOM",
        value: "Salle d'attende",
        color: "#04618B",
        classColor: "back",
        icon: <WaitingCircleIcon/>,
    },
    4: {
        key: "ON_GOING",
        value: "En consultation",
        color: "#1BC47D",
        classColor: "success",
        icon: <OnGogingCircleIcon/>,
    },
    5: {
        key: "FINISHED",
        value: "Effectué",
        color: "#0096d6",
        classColor: "primary",
        icon: <FinishedCircleIcon/>,
    },
    6: {
        key: "CANCELED",
        value: "Annulé",
        color: "#c92a2a",
        classColor: "error",
        icon: <CancelCircleIcon/>,
    },
    7: {
        key: "EXPIRED",
        value: "Expiré",
        color: "#ff6600",
        classColor: "expire",
        icon: <ExpiredCircleIcon/>,
    },
    8: {
        key: "PAUSED",
        value: "En pause",
        color: "#ff6660",
        classColor: "warning",
        icon: <PauseIcon/>
    },
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
        icon: <NoShowCircleIcon/>,
    },
    11: {
        key: "ONLINE",
        value: "Rendez-vous depuis le site",
        color: "#7C878E",
        classColor: "back",
        icon: <Avatar
            sx={{
                width: 18,
                height: 18
            }}
            alt="Online appointment"
            src="/static/icons/Med-logo_.svg"
        />,
    },
    15: {
        key: "PATIENT_CANCELED",
        value: "Annulé",
        color: "#CC1D91",
        classColor: "error",
        icon: <CancelAppointmentPatientIcon/>,
    }
};

export const TableHead = [
    {
        id: "heure",
        label: "header.heure",
        align: "left",
        sortable: true,
    },
    {
        id: "patient",
        label: "header.patient",
        align: "center",
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
    /*    {
            id: "agenda",
            label: "header.agenda",
            align: "center",
            sortable: true,
        },*/
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
    mainIcon: "agenda/ic-agenda-+",
    title: "table.no-data.event.title",
    description: "table.no-data.event.description"
};

export const SlotFormat = {
    hour: "numeric",
    minute: "2-digit",
    omitZeroMinute: false,
    hour12: false,
} as FormatterInput;

type ContextMenuProps = {
    title: string;
    icon: any;
    action: string;
    feature: string;
    permission: string;
};

function tuple<T extends ContextMenuProps[]>(...o: T) {
    return o;
}

export const CalendarContextMenu = tuple(
    {
        title: "start_the_consultation",
        icon: <PlayCircleFilledWhiteOutlinedIcon/>,
        action: "onConsultationDetail",
        feature: "agenda",
        permission: "agenda__appointment__start"
    },
    {
        title: "consultation_pay",
        icon: <IconUrl width={20} height={20} color={"white"} path="ic-fees"/>,
        action: "onPay",
        feature: "cashbox",
        permission: "cash_box__transaction__create"
    },
    {
        title: "pre_consultation_data",
        icon: <Icon color={"white"} width={20} height={20} path="docs/ic-note"/>,
        action: "onPreConsultation",
        feature: "agenda",
        permission: "agenda__appointment__add_follow_up_data"
    },
    {
        title: "import_document",
        icon: <Icon color={"white"} width={20} height={20} path="fileadd"/>,
        action: "onAddConsultationDocuments",
        feature: "agenda",
        permission: "agenda__appointment__import_document"
    },
    {
        title: "confirm_appointment",
        icon: <CheckCircleOutlineRoundedIcon/>,
        action: "onConfirmAppointment",
        feature: "agenda",
        permission: "agenda__appointment__auto_confirm"
    },
    {
        title: "view_the_consultation",
        icon: <PlayCircleIcon/>,
        action: "onConsultationView",
        feature: "consultation",
        permission: "*"
    },
    {
        title: "add_patient_to_waiting_room",
        icon: <Icon color={"white"} width={20} height={20} path="ic_waiting_room"/>,
        action: "onWaitingRoom",
        feature: "waiting-room",
        permission: "waiting-room__waiting-room__show"
    },
    {
        title: "patient_no_show",
        icon: <PersonOffIcon/>,
        action: "onPatientNoShow",
        feature: "agenda",
        permission: "agenda__appointment__patient_show_up"
    },
    {
        title: "leave_waiting_room",
        icon: <Icon color={"white"} width={20} height={20} path="ic_waiting_room"/>,
        action: "onLeaveWaitingRoom",
        feature: "waiting-room",
        permission: "waiting-room__waiting-room__show"
    },
    {
        title: "see_patient_form",
        icon: <Icon color={"white"} width={"20"} height={"20"} path="docs/antecedent"/>,
        action: "onPatientDetail",
        feature: "patients",
        permission: "patients__patient__show"
    },
    {
        title: "reschedule_appointment",
        icon: <Icon color={"white"} width={"20"} height={"20"} path="agenda/ic-agenda-jour"/>,
        action: "onReschedule",
        feature: "agenda",
        permission: "agenda__appointment__reshedule"
    },
    {
        title: "move_appointment",
        icon: <Icon color={"white"} path="iconfinder"/>,
        action: "onMove",
        feature: "agenda",
        permission: "agenda__appointment__edit"
    },
    {
        title: "cancel_appointment",
        icon: <Icon color={"white"} width={"16"} height={"16"} path="close"/>,
        action: "onCancel",
        feature: "agenda",
        permission: "agenda__appointment__cancel"
    },
    {
        title: "delete_appointment",
        icon: <Icon color={"white"} width={"20"} height={"20"} path="ic-delete"/>,
        action: "onDelete",
        feature: "agenda",
        permission: "agenda__appointment__delete"
    }
);

export type ContextMenuModel = typeof CalendarContextMenu[number];
