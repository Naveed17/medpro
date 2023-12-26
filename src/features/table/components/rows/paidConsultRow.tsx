import TableCell from "@mui/material/TableCell";
import {
  Avatar,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { TableRowStyled } from "@features/table";
import IconUrl from "@themes/urlIcon";

function PaidConsultRow({ ...props }) {
  const theme = useTheme();
  const { row, data } = props;
  const { devise } = data;
  return (
    <TableRowStyled className="paid-consult-row">
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconUrl
            path="ic-agenda-jour"
            width={14}
            height={14}
            color={theme.palette.text.primary}
          />
          <Typography variant="body2" fontWeight={600}>
            {row?.appointment.dayDate}
          </Typography>
          <IconUrl path="ic-time" width={14} height={14} />
          <Typography variant="body2" fontWeight={600}>
            {row?.appointment.startTime}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align="center">
        <Typography color="text.primary" variant="body2" fontWeight={600}>
          {row?.appointment?.fees} {devise}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography color="text.primary" variant="body2" fontWeight={600}>
          {row?.amount} {devise}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography color="text.primary" variant="body2" fontWeight={600}>
          {row?.appointment?.restAmount} {devise}
        </Typography>
      </TableCell>
    </TableRowStyled>
  );
}

export default PaidConsultRow;
