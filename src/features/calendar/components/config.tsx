import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import Icon from "@themes/urlIcon";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {FormatterInput} from "@fullcalendar/common";

export const AppointmentStatus: { [key: string]: AppointmentStatusModel } = {
  0: { key: "PENDING", value: "En attende", color: "#FFD400" },
  1: { key: "CONFIRMED", value: "Confirmé", color: "#1BC47D" },
  2: { key: "REFUSED", value: "Effectué", color: "#E83B68" },
  3: { key: "WAITING_ROOM", value: "Salle d'attende", color: "#04618B" },
  4: { key: "ON_GOING", value: "en attende", color: "#1939B7" },
  5: { key: "FINISHED", value: "en attende", color: "#0096d6" },
  6: { key: "CANCELED", value: "Annulé", color: "#c92a2a" },
  7: { key: "EXPIRED", value: "Expiré", color: "#ff6600" },
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
        WED: 3
    }
    return days[day];
}


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
    title: "add_patient_to_waiting_room",
    icon: <Icon color={"white"} path="ic-salle" />,
    action: "onWaitingRoom",
  },
  {
    title: "see_patient_form",
    icon: <InsertDriveFileOutlinedIcon />,
    action: "onPatientDetail",
  },
  {
    title: "send_a_message",
    icon: <SmsOutlinedIcon />,
    action: "onSend",
  },
  {
    title: "import_document",
    icon: <SaveAltOutlinedIcon />,
    action: "onImport",
  },
  {
    title: "move_appointment",
    icon: <Icon color={"white"} path="iconfinder" />,
    action: "onMove",
  },
  {
    title: "cancel_appointment",
    icon: <DeleteOutlineOutlinedIcon />,
    action: "onCancel",
  },
];
