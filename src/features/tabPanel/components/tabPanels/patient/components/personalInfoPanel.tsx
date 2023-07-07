// ______________________________
import {
    PersonalInfoCard,
    PatientDetailContactCard,
    PersonalInsuranceCard,
    AntecedentsCard
} from "@features/card";
import {Stack} from "@mui/material";
import {useState} from "react";

function PersonInfoPanel({...props}) {
    const [editable, setEditable] = useState(false);
    const [currentSection, setCurrentSection] = useState("");

    return (
        <Stack spacing={2} className={"container"}>
            <PersonalInfoCard {...{
                editable, setEditable,
                currentSection, setCurrentSection, ...props
            }} />
            <PersonalInsuranceCard {...{editable, ...props}} />
{/*            <PatientDetailContactCard {...{
                editable, setEditable,
                currentSection, setCurrentSection, ...props
            }} />*/}
            <AntecedentsCard {...props} />
        </Stack>
    );
}

export default PersonInfoPanel;
