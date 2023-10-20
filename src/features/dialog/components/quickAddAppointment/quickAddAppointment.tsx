import QuickAddAppointmentStyled from "./overrides/quickAddAppointmentStyled";
import {EventType, Patient, TimeSchedule} from "@features/tabPanel";
import {useRef} from "react";
import {Typography} from "@mui/material";

function QuickAddAppointment({...props}) {
    const {handleAddPatient, t} = props;
    const bottomRef = useRef(null);

    return (
        <QuickAddAppointmentStyled>
            <Typography variant={"body2"}>{t("add-quick-drawer")}</Typography>
            <EventType select defaultType={0}/>
            <TimeSchedule select/>
            <Patient
                select
                {...{handleAddPatient}}
                onPatientSearch={() => {
                    setTimeout(() => {
                        (bottomRef.current as unknown as HTMLElement)?.scrollIntoView({behavior: 'smooth'});
                    }, 300);
                }}/>
            <div ref={bottomRef}/>
        </QuickAddAppointmentStyled>
    )
}

export default QuickAddAppointment;
