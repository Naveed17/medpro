import {Otable} from "@features/table";
import {TableHead} from "@features/calendar";
import React, {MutableRefObject, useEffect, useRef} from "react";
import usePendingAppointment from "@lib/hooks/rest/usePendingAppointment";
import {appointmentGroupByDate, appointmentPrepareEvent} from "@lib/hooks";

function PendingAppointmentDialog({...props}) {
    const {t, handleTableEvent} = props.data;
    const {pendingAppointments} = usePendingAppointment()
    let pendingEvents: MutableRefObject<EventModal[]> = useRef([]);

    useEffect(() => {
        pendingEvents.current = [];
        pendingAppointments?.map(event => pendingEvents.current.push(appointmentPrepareEvent(event, false, [])))
    }, [pendingAppointments]);

    return (
        <Otable
            {...{t, pendingData: true}}
            maxHeight={`calc(100vh - 180px)`}
            headers={TableHead.filter((head: any) => head.id !== "motif")}
            handleEvent={handleTableEvent}
            rows={appointmentGroupByDate(pendingEvents.current)}
            from={"calendar"}
        />
    )
}

export default PendingAppointmentDialog;
