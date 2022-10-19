import QuickAddAppointmentStyled from "./overrides/quickAddAppointmentStyled";
import {Typography} from "@mui/material";
import {EventType} from "@features/tabPanel";

function QuickAddAppointment(){
    return(
        <QuickAddAppointmentStyled>
            <EventType select />
        </QuickAddAppointmentStyled>
    )
}

export default QuickAddAppointment;
