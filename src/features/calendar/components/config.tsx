import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import Icon from "@themes/urlIcon";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export const AppointmentTypes: { [key: string]: AppointmentTypeModel } = {
    0: {key: "PENDING", value: "En attende"},
    1: {key: "CONFIRMED", value: "Confirmé"},
    2: {key: "REFUSED", value: "Effectué"},
    3: {key: "WAITING_ROOM", value: "Salle d'attende"},
    4: {key: "ON_GOING", value: "en attende"},
    5: {key: "FINISHED", value: "en attende"},
    6: {key: "CANCELED", value: "Annulé"},
    7: {key: "EXPIRED", value: "Expiré"},
}

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

export const AddAppointmentCardData = {
    mainIcon: "ic-agenda-+",
    title: "table.no-data.event.title",
    description: "table.no-data.event.description",
    buttonText: "table.no-data.event.button-text",
    buttonIcon: "ic-agenda-+",
    buttonVariant: "warning",
};

export const CalendarContextMenu = [
    {
        title: "start_the_consultation",
        icon: <PlayCircleIcon/>,
        action: "onOpenEditPatient",
    },
    {
        title: "add_patient_to_waiting_room",
        icon: <Icon color={"white"} path='ic-salle'/>,
        action: "onOpenDetails",
    },
    {
        title: "see_patient_form",
        icon: <InsertDriveFileOutlinedIcon/>,
        action: "onShowPatient",
    },
    {
        title: "send_a_message",
        icon: <SmsOutlinedIcon/>,
        action: "onSend",
    },
    {
        title: "import_document",
        icon: <SaveAltOutlinedIcon/>,
        action: "onImport",
    },
    {
        title: "move_appointment",
        icon: <Icon color={"white"} path="iconfinder"/>,
        action: "onMove",
    },
    {
        title: "cancel_appointment",
        icon: <DeleteOutlineOutlinedIcon/>,
        action: "onCancel",
    }
];
