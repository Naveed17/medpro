// material
import { Typography, TableCell, Button, Box, Skeleton } from "@mui/material";
import { useTranslation } from "next-i18next";
import Icon from '@themes/urlIcon'
// style
import RootStyled from "./overrides/rootStyled";
function RdvCard({ ...props }) {
  const { inner, loading } = props;
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
            bgcolor: loading ? "green" : inner.consultationReason?.color,
          },
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Icon path="ic-agenda" />
          <Typography variant="body2" color="text.secondary" sx={{ mr: 3 }}>
            {loading ? <Skeleton variant="text" width={100} /> : inner.dayDate}
          </Typography>
          <Icon path="ic-time" />
          <Typography variant="body2" color="text.secondary">
            {loading ? (
              <Skeleton variant="text" width={100} />
            ) : (
              inner.startTime
            )}
          </Typography>
        </Box>
      </TableCell>
      <TableCell className="cell-motif">
        {loading ? (
          <Skeleton variant="text" width={100} />
        ) : (
          <>
            {inner.meeting && <Icon path="ic-video" />}

            <Typography variant="body2" color="primary.main">
              {" "}
              {inner.consultationReason?.name}
            </Typography>
          </>
        )}
      </TableCell>
      <TableCell align="right">
        {loading ? (
          <Skeleton variant="text" width={80} height={22} sx={{ ml: "auto" }} />
        ) : (
          <Button variant="text" color="primary" size="small">
            {t("see-details")}
          </Button>
        )}
      </TableCell>
    </RootStyled>
  );
}

export default RdvCard;
