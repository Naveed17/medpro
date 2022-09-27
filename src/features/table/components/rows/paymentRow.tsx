import TableCell from "@mui/material/TableCell";
import {
  Typography,
  Box,
  Checkbox,
  Button,
  IconButton,
  Skeleton,
  Stack,
  Link,
} from "@mui/material";
import { TableRowStyled } from "@features/table";
import Icon from "@themes/urlIcon";
// redux
import { useAppDispatch } from "@app/redux/hooks";
import { alpha, Theme } from '@mui/material/styles';
import Image from "next/image";
import { Label } from '@features/label'

function PaymentRow({ ...props }) {
  const { row, isItemSelected, handleClick, t, labelId, loading } = props;
  return (
    <TableRowStyled
      hover
      onClick={() => !loading && handleClick(row.uuid as string)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={Math.random()}
      selected={isItemSelected}
      className="payment-row"
      sx={{
        bgcolor: (theme: Theme) => alpha(theme.palette[row.color].main, 0.1)
      }}
    >
      <TableCell padding="checkbox">
        {loading ? (
          <Skeleton variant="circular" width={28} height={28} />
        ) : (
          <Checkbox
            color="primary"
            checked={isItemSelected}
            inputProps={{
              "aria-labelledby": labelId,
            }}
          />
        )}
      </TableCell>
      <TableCell>
        {loading ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton width={20} height={30} />
            <Skeleton width={100} />
          </Stack>
        ) : (
          <Stack direction='row' alignItems="center" spacing={1} sx={{
            '.react-svg': {
              svg: {
                width: 11,
                height: 11,
                path: {
                  fill: theme => theme.palette.text.primary
                }
              }
            }
          }}>
            <Icon path="ic-agenda" />
            <Typography variant="body2">{row.date}</Typography>
          </Stack>

        )}
      </TableCell>
      <TableCell>
        {loading ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton width={100} />
          </Stack>
        ) : (
          <Stack direction='row' alignItems="center" spacing={1} sx={{
            '.react-svg': {
              svg: {
                width: 11,
                height: 11,
                path: {
                  fill: theme => theme.palette.text.primary
                }
              }
            }
          }}>
            <Icon path="ic-time" />
            <Typography variant="body2">{row.time}</Typography>
          </Stack>

        )}
      </TableCell>
      <TableCell>
        {loading ? (

          <Skeleton width={80} />

        ) : (
          <Link underline="none">{row.name}</Link>

        )}
      </TableCell>
      <TableCell>
        {loading ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton width={20} height={30} />
            <Skeleton width={100} />
          </Stack>
        ) : (
          <Stack direction='row' alignItems="center" spacing={1}>
            <Image src={`/static/img/${row.insurance.img}.png`} width={20} height={20} alt={row.insurance.name} />
            <Typography variant="body2">{row.insurance.name}</Typography>
          </Stack>

        )}
      </TableCell>
      <TableCell>
        {loading ? (

          <Skeleton width={80} />

        ) : (
          <Typography variant="body2" color="text.primary">{t(row.type)}</Typography>

        )}
      </TableCell>
      <TableCell align="center">
        {loading ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton width={20} height={30} />
            <Skeleton width={20} height={30} />

          </Stack>
        ) : (
          <Stack direction='row' alignItems="center" justifyContent='center' spacing={1}>
            {
              row.payment_type.map((type: string, i: number) =>
                <Icon key={i} path={type} />
              )
            }
          </Stack>

        )}
      </TableCell>
      <TableCell align="center">
        {loading ? (
          <Skeleton width={40} height={40} />

        ) : (
          <Label className="label" variant="ghost" color={row.billing_status === "yes" ? "success" : 'error'}>{t(row.billing_status)}</Label>

        )}
      </TableCell>
      <TableCell align="center">
        {loading ? (
          <Skeleton width={40} height={20} />

        ) : (
          <Typography color={row.amount > 0 && 'success.main' || 'text.primary'} fontWeight={700}>{row.amount}</Typography>

        )}
      </TableCell>
    </TableRowStyled>
  );
}
export default PaymentRow;
