// ______________________________
import { PersonalInfoCard, BackgroundCard } from "@features/card";

function PersonInfoPanel({ ...props }) {
  return (
    <div>
      <PersonalInfoCard {...props} />
      <BackgroundCard {...props} />
    </div>
  );
}
export default PersonInfoPanel;
