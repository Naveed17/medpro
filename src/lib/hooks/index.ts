import moment from "moment-timezone";
import {AppointmentStatus} from "@features/calendar";

require('moment-precise-range-plugin');
export {default as useIsMountedRef} from "./useIsMountedRef";
export {default as useDateConverture} from "./useDateConverture";
export {default as unsubscribeTopic} from "./unsubscribeTopic";
export {default as useMedicalEntitySuffix} from "./useMedicalEntitySuffix";
export {default as useMedicalProfessionalSuffix} from "./useMedicalProfessionalSuffix";
export {default as useLastPrescription} from "./useLastPrescription";
export * from "./prepareSearchKeys";
export * from "./prepareInsurancesData";
export * from "./filterReasonOptions";
export * from "./capitalizeFirst";
export * from "./checkNotification";
export * from "./rest/useAppointment";
export * from './rest/useContactType'

export function getDifference<T>(a: T[], b: T[]): T[] {
    return a.filter((element) => {
        return !b.includes(element);
    });
}

export function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export function clearBrowserCache() {
    // Clearing the session storage
    sessionStorage.clear();
    // Clearing the browser storage
    localStorage.clear();
    // Clearing the browser cache
    caches.keys().then((keyList) => Promise.all(keyList.map((key) => caches.delete(key))));
}

Array.prototype.group = (items, fn) => {
    return items.reduce((prev: any, next: any) => {
            const prop = fn(next);
            return {
                ...prev,
                [prop]: prev[prop] ? [...prev[prop], next] : [next],
            };
        }
        , {})
};

export const ConditionalWrapper = ({...props}) => {
    const {condition, wrapper, children} = props;
    return condition ? wrapper(children) : children;
}

export const getBirthdayFormat = (patient: PatientModel, t: any, keyPrefix?: string) => {
    const birthday = moment().preciseDiff(moment(patient?.birthdate, "DD-MM-YYYY"), true);
    return `${birthday.years ? `${birthday.years} ${t(`${keyPrefix ? `${keyPrefix}.` : ""}years`).toLowerCase()}${birthday.years <= 2 ? "," : ""} ` : ""}
         ${birthday.years <= 2 && birthday.months ? `${birthday.months} ${t(`${keyPrefix ? `${keyPrefix}.` : ""}months`).toLowerCase()}, ` : ""} 
         ${birthday.years <= 2 && birthday.days ? `${birthday.days} ${t(`${keyPrefix ? `${keyPrefix}.` : ""}days`).toLowerCase()}` : ""}`;
};

export const appointmentGroupByDate = (events: any[]) => {
    // this gives an object with dates as keys
    const groups: any = events.reduce(
        (groups: any, data: any) => {
            const date = moment(data.time, "ddd MMM DD YYYY HH:mm:ss")
                .format('DD-MM-YYYY');
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(data);
            return groups;
        }, {});

    // Edit: to add it in the array format instead
    return Object.keys(groups).map((date) => {
        return {
            date,
            events: groups[date]
        };
    });
}

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
        fees: appointment.fees,
        isOnline: appointment.isOnline,
        overlapEvent: appointment.overlapEvent ? appointment.overlapEvent : false,
        motif: appointment.consultationReasons,
        instruction: appointment.instruction !== null ? appointment.instruction : "",
        id: appointment.uuid,
        updatedAt: moment(appointment.updatedAt, "DD-MM-YYYY HH:mm"),
        filtered: false,
        hasErrors,
        dur: appointment.duration,
        type: appointment.type,
        meeting: false,
        new: moment(appointment.createdAt, "DD-MM-YYYY HH:mm").add(1, "hours").isBetween(moment().subtract(30, "minutes"), moment(), "minutes", '[]'),
        addRoom: true,
        status: AppointmentStatus[appointment.status]
    }
}

