import moment from "moment-timezone";

export const prepareContextMenu = (action: string, eventMenu: EventModal) => {
    return eventMenu?.status && (
        action === "onWaitingRoom" &&
        (moment().format("DD-MM-YYYY") !== moment(eventMenu?.time).format("DD-MM-YYYY") || eventMenu?.patient?.isArchived ||
            ["PENDING", "WAITING_ROOM", "ON_GOING", "FINISHED"].includes(eventMenu?.status.key)) ||
        action === "onConsultationView" &&
        (!["FINISHED", "ON_GOING"].includes(eventMenu?.status.key)) ||
        action === "onConsultationDetail" &&
        (["FINISHED", "ON_GOING", "PENDING", "PATIENT_CANCELED", "CANCELED", "NOSHOW"].includes(eventMenu?.status.key) || eventMenu?.patient?.isArchived) ||
        action === "onPreConsultation" &&
        (["FINISHED", "ON_GOING", "PENDING"].includes(eventMenu?.status.key) || eventMenu?.patient?.isArchived) ||
        action === "onLeaveWaitingRoom" &&
        eventMenu?.status.key !== "WAITING_ROOM" ||
        action === "onCancel" &&
        (["CANCELED", "PATIENT_CANCELED", "FINISHED", "ON_GOING"].includes(eventMenu?.status.key) || eventMenu?.patient?.isArchived) ||
        action === "onDelete" &&
        ["ON_GOING"].includes(eventMenu?.status.key) ||
        action === "onMove" &&
        (eventMenu?.status.key !== "CONFIRMED" || ["FINISHED", "ON_GOING"].includes(eventMenu?.status.key) || eventMenu?.patient?.isArchived) ||
        action === "onPatientNoShow" &&
        ((moment().endOf('day').isBefore(eventMenu?.time) || ["ON_GOING", "FINISHED", "NOSHOW"].includes(eventMenu?.status.key)) || eventMenu?.patient?.isArchived) ||
        action === "onConfirmAppointment" &&
        eventMenu?.status.key !== "PENDING" ||
        action === "onReschedule" &&
        (((moment().isBefore(eventMenu?.time) && eventMenu?.status.key === "CONFIRMED") || eventMenu?.status.key === "CONFIRMED") || eventMenu?.patient?.isArchived) ||
        ["onPatientDetail", "onAddConsultationDocuments"].includes(action) &&
        eventMenu?.patient?.isArchived ||
        action === "onPay" &&
        !["FINISHED", "WAITING_ROOM"].includes(eventMenu?.status.key)
    )
}
