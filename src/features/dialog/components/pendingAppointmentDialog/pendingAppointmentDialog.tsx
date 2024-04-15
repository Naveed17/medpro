import {Otable} from "@features/table";
import {TableHead} from "@features/calendar";
import React, {useEffect, useState} from "react";
import usePendingAppointment from "@lib/hooks/rest/usePendingAppointment";
import {appointmentGroupByDate, appointmentPrepareEvent} from "@lib/hooks";

function PendingAppointmentDialog({...props}) {
    const {t, handleTableEvent} = props.data;
    const {pendingAppointments} = usePendingAppointment();
    const [eventGroupByDay, setEventGroupByDay] = useState<GroupEventsModel[]>([]);

    useEffect(() => {
        if (pendingAppointments.length > 0) {
            const pendingApps = pendingAppointments?.map(event => appointmentPrepareEvent(event, false, []));
            setEventGroupByDay(appointmentGroupByDate(pendingApps));
        }
    }, [pendingAppointments]);

    return (
        <Otable
            {...{t, pendingData: true}}
            maxHeight={`calc(100vh - 180px)`}
            headers={TableHead.filter((head: any) => head.id !== "motif")}
            handleEvent={handleTableEvent}
            rows={eventGroupByDay}
            from={"calendar"}
        />
    )
}

export default PendingAppointmentDialog;
