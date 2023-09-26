import moment from "moment-timezone";
import {AppointmentStatus} from "@features/calendar";

export const appointmentPrepareEvent = (appointment: AppointmentModel, horsWork: boolean, hasErrors: any[]) => {
    return {
        start: moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY HH:mm").toDate(),
        time: moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY HH:mm").toDate(),
        end: moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY HH:mm").add(appointment.duration, "minutes").toDate(),
        title: appointment.patient?.firstName + ' ' + appointment.patient?.lastName,
        allDay: horsWork,
        eventStartEditable: !["FINISHED", "ON_GOING"].includes(AppointmentStatus[appointment.status].key),
        eventResizableFromStart: !["FINISHED", "ON_GOING"].includes(AppointmentStatus[appointment.status].key),
        eventDurationEditable: !["FINISHED", "ON_GOING"].includes(AppointmentStatus[appointment.status].key),
        droppable: !["ON_GOING"].includes(AppointmentStatus[appointment.status].key),
        borderColor: appointment.type?.color,
        patient: appointment.patient,
        payed: (appointment?.restAmount ?? 0) === 0,
        restAmount: appointment?.restAmount,
        isOnline: appointment.isOnline,
        overlapEvent: appointment.overlapEvent ? appointment.overlapEvent : false,
        motif: appointment.consultationReasons,
        instruction: appointment.instruction !== null ? appointment.globalInstructions : "",
        reminder: appointment.reminder?.length > 0 ? appointment.reminder : [],
        id: appointment.uuid,
        updatedAt: moment(appointment.updatedAt, "DD-MM-YYYY HH:mm"),
        filtered: false,
        hasErrors,
        dur: appointment.duration,
        type: appointment.type,
        new: moment(appointment.createdAt, "DD-MM-YYYY HH:mm").add(1, "hours").isBetween(moment().subtract(30, "minutes"), moment(), "minutes", '[]'),
        status: AppointmentStatus[appointment.status]
    }
}
