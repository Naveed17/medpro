// ______________________________
import {PersonalInfoCard, BackgroundCard, PatientDetailContactCard, PersonalInsuranceCard} from "@features/card";
import { Stack } from "@mui/material";

function PersonInfoPanel({ ...props }) {
  return (
    <Stack spacing={2} className={"container"}>
      <PersonalInfoCard {...props} />
      <PersonalInsuranceCard {...props} />
      <PatientDetailContactCard {...props} />
      <BackgroundCard {...props} />
    </Stack>
  );
}
export default PersonInfoPanel;
