// material
import { Typography, TableCell, Button, Box, Skeleton, Stack, IconButton } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
// urils
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";
import { useTranslation } from "next-i18next";
// style
import RootStyled from "./overrides/rootStyled";
import { ModelDot } from '@features/modelDot'
function RdvCard({ ...props }) {
  const { inner, loading } = props;
  console.log(inner)
  const { t, ready } = useTranslation("patient", {
    keyPrefix: "patient-details",
  });
  if (!ready) return <>loading translations...</>;
  return (
    <RootStyled>
      <TableCell
      >
        <Box sx={{ display: "flex" }}>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.primary" sx={{ mr: 3 }}>
              {loading ? <Skeleton variant="text" width={100} /> : t("reason")}
            </Typography>
            <Stack direction='row' alignItems="center">
              <ModelDot color={inner.consultationReason ? inner.consultationReason?.color : '#1BC47D'} selected={false} size={20} sizedot={12}
                padding={3} marginRight={5} />
              <Typography variant="body2" color="text.primary">{inner?.type?.name}</Typography>
            </Stack>
          </Stack>
        </Box>
      </TableCell>
      <TableCell>
        {loading ? (
          <Skeleton variant="text" width={100} />
        ) : (
          <Stack spacing={1}>
            <Typography variant="body2" color="text.primary">
              {t('date')}
            </Typography>
            <Stack spacing={3} direction="row" alignItems='center'>
              <Stack spacing={1} direction="row" alignItems='center' className="date-time">
                <Icon path="ic-agenda" />
                <Typography fontWeight={700} variant="body2" color="text.primary">
                  {inner?.dayDate}
                </Typography>
              </Stack>
              <Stack spacing={1} direction="row" alignItems='center'>
                <Icon path="ic-time" />
                <Typography fontWeight={700} variant="body2" color="text.primary">
                  {inner?.startTime}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        )}

      </TableCell>

      <TableCell align="right" sx={{ p: "0px 12px!important" }}>
        {!loading && inner.addRoom && (
          <Button variant="text" color="primary" size="small" sx={{ mr: 1 }}>
            {t("add-waiting-room")}
          </Button>
        )}
        {loading ? (
          <Skeleton variant="text" width={80} height={22} sx={{ ml: "auto" }} />
        ) : (
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        )}
      </TableCell>
    </RootStyled>
  );
}
export default RdvCard;
