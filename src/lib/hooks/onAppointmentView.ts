import moment from "moment";
import {AppointmentStatus, openDrawer, setSelectedEvent} from "@features/calendar";

export const onAppointmentView = ({...props}) => {
    const {dispatch, patient, inner} = props;
    const event: any = {
        title: `${patient.firstName}  ${patient.lastName}`,
        publicId: inner.uuid,
        extendedProps: {
            time: moment(`${inner.dayDate} ${inner.startTime}`, 'DD-MM-YYYY HH:mm').toDate(),
            patient: patient,
            motif: inner.consultationReasons,
            instruction: inner.instruction,
            reminder: inner.reminder ?? [],
            description: "",
            meeting: false,
            status: AppointmentStatus[inner.status]
        }
    }
    dispatch(setSelectedEvent(event));
    dispatch(openDrawer({type: "view", open: true}));
}
