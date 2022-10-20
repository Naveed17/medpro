import QuickAddAppointmentStyled from "./overrides/quickAddAppointmentStyled";
import {EventType, Patient, TimeSchedule} from "@features/tabPanel";
import {useRef} from "react";

function QuickAddAppointment() {
    const bottomRef = useRef(null);

    return (
        <QuickAddAppointmentStyled>
            <EventType select/>
            <TimeSchedule select/>
            <Patient select onPatientSearch={() => {
                setTimeout(() => {
                    (bottomRef.current as unknown as HTMLElement)?.scrollIntoView({behavior: 'smooth'});
                }, 300)
            }}/>
            <div ref={bottomRef}/>
        </QuickAddAppointmentStyled>
    )
}

export default QuickAddAppointment;
