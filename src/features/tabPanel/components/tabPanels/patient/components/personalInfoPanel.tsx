import { Stack } from "@mui/material";
import dynamic from "next/dynamic";

const PersonalInfoCard = dynamic(() =>
    import('@features/card').then((mod) => mod.PersonalInfoCard))
const PatientDetailContactCard = dynamic(() =>
    import('@features/card').then((mod) => mod.PatientDetailContactCard))
const PersonalInsuranceCard = dynamic(() =>
    import('@features/card').then((mod) => mod.PersonalInsuranceCard))
const AntecedentsCard = dynamic(() =>
    import('@features/card').then((mod) => mod.AntecedentsCard))

function PersonInfoPanel({ ...props }) {
    const { countries_api, contacts, contactData, patientPhoto, ...other } = props;
    return (
        <Stack className={"container"}>
            <PersonalInfoCard {...{ countries_api, patientPhoto, ...other }} />
            <PatientDetailContactCard {...{ contacts, contactData, countries_api, ...other }} />
            <PersonalInsuranceCard {...{ contacts, ...other }} />
            {/* <AntecedentsCard {...other} /> */}
        </Stack>
    );
}

export default PersonInfoPanel;
