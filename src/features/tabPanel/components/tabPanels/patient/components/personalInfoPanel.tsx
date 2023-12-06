import {
    PersonalInfoCard,
    PatientDetailContactCard,
    PersonalInsuranceCard,
    AntecedentsCard
} from "@features/card";
import {Stack} from "@mui/material";
import {useContactType, useCountries} from "@lib/hooks/rest";

function PersonInfoPanel({...props}) {
    const {contacts} = useContactType();
    const {countries: countries_api} = useCountries("nationality=true");

    return (
        <Stack spacing={2} className={"container"}>
            <PersonalInfoCard {...{countries_api, ...props}} />
            <PersonalInsuranceCard {...{contacts, ...props}} />
            <PatientDetailContactCard {...{contacts, countries_api, ...props}} />
            <AntecedentsCard {...props} />
        </Stack>
    );
}

export default PersonInfoPanel;
