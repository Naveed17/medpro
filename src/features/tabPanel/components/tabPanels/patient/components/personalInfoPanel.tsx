// ______________________________
import { PersonalInfoCard, BackgroundCard, PatientDetailContactCard } from "@features/card";
import { Stack } from "@mui/material";

function PersonInfoPanel({ ...props }) {
  return (
    <Stack spacing={2}>
      <PersonalInfoCard {...props} />
      <PatientDetailContactCard {...props} />
      <BackgroundCard {...props} />

    </Stack>
  );
}
export default PersonInfoPanel;
