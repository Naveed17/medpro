import TableCell from "@mui/material/TableCell";
import {
  Typography,
  Skeleton,
  Stack,
  Link
} from "@mui/material";
import { TableRowStyled } from "@features/table";
import Icon from "@themes/urlIcon";


function PaymentDialogRow({ ...props }) {
  const { row, loading, t } = props;
  return (
    <TableRowStyled
      hover
      key={Math.random()}
      className="payment-dialog-row"
    >
      <TableCell padding="checkbox">
        {loading ? (
          <Stack direction='row' spacing={1}>
            <Skeleton width={100} />
            <Skeleton width={100} />
          </Stack>

        ) : (
          <Stack direction='row' spacing={2} alignItems="center">
            <Stack direction='row' spacing={.5} alignItems="center">
              <Icon path="ic-agenda" />
              <Typography variant="body2">
                {row.date}
              </Typography>
            </Stack>
            <Stack direction='row' spacing={.5} alignItems="center">
              <Icon path="ic-agenda" />
              <Typography variant="body2">
                {row.date2}
              </Typography>
            </Stack>
            <Stack direction='row' spacing={.5} alignItems="center">
              <Icon path="ic-time" />
              <Typography variant="body2">
                {row.time}
              </Typography>
            </Stack>
          </Stack>
        )}
      </TableCell>
      <TableCell>
        {loading ? (
          <Skeleton width={80} />
        ) : (
          <Link underline="none">{row.amount} TND</Link>
        )}
      </TableCell>
      <TableCell align="right">
        {loading ? (
          <Skeleton width={80} />
        ) : (
          <Stack direction='row' spacing={3} alignItems="center" justifyContent='flex-end'>
            <Typography variant="body2">
              {t('table.' + row.method.name)}
            </Typography>
            <Icon className="ic-card" path={row.method.icon} />
          </Stack>
        )}
      </TableCell>
    </TableRowStyled>

  );
}
export default PaymentDialogRow;
