import { Typography, Button } from "@mui/material";
import { RootStyled } from "./overrides";
import Icon from "@themes/urlIcon";

export default function AddAppointmentCard({ ...props }) {
  const { data, t } = props;
  const {
    mainIcon,
    title,
    description,
    buttonText,
    buttonIcon,
    buttonVariant,
  } = data;
  return (
    <RootStyled>
      <Icon path={mainIcon} className="main-icon" />
      <Typography
        variant="subtitle1"
        color="text.primary"
        my={3}
        fontWeight={600}
      >
        {t(title)}
      </Typography>
      <Typography variant="body2" color="#00234B" mb={3}>
        {t(description)}
      </Typography>
      <Button
        variant="contained"
        color={buttonVariant}
        startIcon={<Icon path={buttonIcon} />}
      >
        {t(buttonText)}
      </Button>
    </RootStyled>
  );
}
