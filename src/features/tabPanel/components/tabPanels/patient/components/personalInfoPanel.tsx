// ______________________________
import {
    PersonalInfoCard,
    PatientDetailContactCard,
    PersonalInsuranceCard,
    AntecedentsCard
} from "@features/card";
import {Stack} from "@mui/material";
import {useState} from "react";
import {useContactType, useCountries} from "@lib/hooks/rest";

function PersonInfoPanel({...props}) {
    const {contacts} = useContactType();
    const {countries: countries_api} = useCountries("nationality=true");

    const [editable, setEditable] = useState({
        personalInfoCard: false,
        personalInsuranceCard: false,
        patientDetailContactCard: false
    });

    console.log("editable", editable);
    return (
        <Stack spacing={2} className={"container"}>
            <PersonalInfoCard {...{
                editable, setEditable, countries_api, ...props
            }} />
            <PersonalInsuranceCard {...{editable, contacts, ...props}} />
            <PatientDetailContactCard {...{
                editable, setEditable, contacts, countries_api, ...props
            }} />
            <AntecedentsCard {...props} />
        </Stack>
    );
}

export default PersonInfoPanel;
