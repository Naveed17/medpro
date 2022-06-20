
export const rows = [
    {
        id: "#1",
        reson: "1st consultation",
        arrivaltime: "15:00",
        appointmentTime: '15:30',
        duration: '30',
        type: 'cabinet',
        status: "completed",
        patient: "John Doe",
        agenda: "Agenda cabinet",

    },
    {
        id: "#2",
        reson: "1st consultation",
        arrivaltime: "15:00",
        appointmentTime: '15:30',
        duration: '30',
        type: 'teleconsultation',
        status: "canceled",
        patient: "John Doe",
        agenda: "Agenda cabinet",

    },

];
export const headCells = [
    {
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: 'Id',
        align: 'left',
        sortable: true,
    },
    {
        id: 'arrivaltime',
        numeric: false,
        disablePadding: true,
        label: "arrival time",
        align: 'left',
        sortable: true,
    },
    {
        id: 'appointmentTime',
        numeric: false,
        disablePadding: true,
        label: "Appointment time",
        align: 'left',
        sortable: false,
    },
    {
        id: 'motif',
        numeric: false,
        disablePadding: true,
        label: "Reason",
        align: 'left',
        sortable: false,
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: true,
        label: "Status",
        align: 'left',
        sortable: true,
    },
    {
        id: 'patient',
        numeric: false,
        disablePadding: true,
        label: "Patient's name",
        align: 'left',
        sortable: true,
    },
    {
        id: 'agenda',
        numeric: false,
        disablePadding: true,
        label: "Agenda",
        align: 'left',
        sortable: true,
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: true,
        label: "Action",
        align: 'left',
        sortable: false,
    },

];
