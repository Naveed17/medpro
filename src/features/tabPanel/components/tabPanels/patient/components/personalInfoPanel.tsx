// ______________________________
import { PersonalInfoCard, BackgroundCard, PatientDetailContactCard } from "@features/card";
import { Stack } from "@mui/material";

function PersonInfoPanel({ ...props }) {
  return (
    <div className={"container"}>
      <PersonalInfoCard {...props} />
      <PatientDetailContactCard {...props} />
      <BackgroundCard {...props} />

    </div>
  );
}
export default PersonInfoPanel;
