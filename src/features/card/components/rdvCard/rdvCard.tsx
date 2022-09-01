// material
import { Typography, TableCell, Button, Box } from "@mui/material";

// urils
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";
import { useTranslation } from "next-i18next";
// style
import RootStyled from "./overrides/rootStyled";

function RdvCard({ ...props }) {
  const { inner } = props;
  const { t, ready } = useTranslation("patient", {
    keyPrefix: "patient-details",
  });
  if (!ready) return <>loading translations...</>;
  return (
    <RootStyled>
      <TableCell
        className="first-child"
        sx={{
          "&:after": {
            bgcolor: inner.consultationReason.color,
          },
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Icon path="ic-agenda" />
          <Typography variant="body2" color="text.secondary" sx={{ mr: 3 }}>
            {inner.dayDate}
          </Typography>
          <Icon path="ic-time" />
          <Typography variant="body2" color="text.secondary">
            {inner.startTime}
          </Typography>
        </Box>
      </TableCell>
      <TableCell className="cell-motif">
        {inner.meeting && <Icon path="ic-video" />}

        <Typography variant="body2" color="primary.main">
          {" "}
          {inner.consultationReason.name}
        </Typography>
      </TableCell>

      <TableCell align="right" sx={{ p: "0px 12px!important" }}>
        {inner.addRoom && (
          <Button variant="text" color="primary" size="small" sx={{ mr: 1 }}>
            {t("add-waiting-room")}
          </Button>
        )}

        <Button variant="text" color="primary" size="small">
          {t("see-details")}
        </Button>
      </TableCell>
    </RootStyled>
  );
}
export default RdvCard;
