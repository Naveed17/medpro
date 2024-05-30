import {Stack} from "@mui/material";
import dynamic from "next/dynamic";
import {useContactType, useCountries} from "@lib/hooks/rest";

const PersonalInfoCard = dynamic(() =>
    import('@features/card').then((mod) => mod.PersonalInfoCard))
const PatientDetailContactCard = dynamic(() =>
    import('@features/card').then((mod) => mod.PatientDetailContactCard))
const PersonalInsuranceCard = dynamic(() =>
    import('@features/card').then((mod) => mod.PersonalInsuranceCard))
const AntecedentsCard = dynamic(() =>
    import('@features/card').then((mod) => mod.AntecedentsCard))

function PersonInfoPanel({...props}) {
    const {contactData, ...other} = props;
    const {contacts} = useContactType();
    const {countries: countries_api} = useCountries("nationality=true");

    return (
        <Stack spacing={2} className={"container"}>
            {/*<PersonalInfoCard {...{countries_api, ...other}} />*/}
            <PersonalInsuranceCard {...{contacts, ...other}} />
            <PatientDetailContactCard {...{contacts, contactData, countries_api: [], ...other}} />
            <AntecedentsCard {...other} />
        </Stack>
    );
}

export default PersonInfoPanel;
