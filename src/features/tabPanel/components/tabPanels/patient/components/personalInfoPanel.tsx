import {
    PersonalInfoCard,
    PatientDetailContactCard,
    PersonalInsuranceCard,
    AntecedentsCard
} from "@features/card";
import {Stack} from "@mui/material";

function PersonInfoPanel({...props}) {
    const {countries_api, contacts, contactData, ...other} = props;
    return (
        <Stack spacing={2} className={"container"}>
            <PersonalInfoCard {...{countries_api, ...other}} />
            <PersonalInsuranceCard {...{contacts, ...other}} />
            <PatientDetailContactCard {...{contacts, contactData, countries_api, ...other}} />
            <AntecedentsCard {...other} />
        </Stack>
    );
}

export default PersonInfoPanel;
