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
  Collapse,
  Table,
  TableBody,
  TableRow,
} from "@mui/material";
import { TableRowStyled } from "@features/table";
import Icon from "@themes/urlIcon";
// redux
import { useAppDispatch } from "@app/redux/hooks";
import { addBilling } from "@features/table";
import { alpha, Theme } from '@mui/material/styles';
import Image from "next/image";
import { Label } from '@features/label'
import { useState, useEffect } from 'react'
function PaymentRow({ ...props }) {
  const dispatch = useAppDispatch();
  const { row, isItemSelected, handleClick, t, labelId, loading, editMotif } = props;
  const [selected, setSelected] = useState<any>([])
  const handleChildSelect = (id: any) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  useEffect(() => {
    if (!isItemSelected) {
      setSelected([])
    }
  }, [isItemSelected])
  useEffect(() => {
    dispatch(addBilling(selected))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])
  return (
    <>
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
          bgcolor: (theme: Theme) => alpha(
            (row.pending && theme.palette.warning.darker)
            || (row.amount > 0 && theme.palette.success.main)
            || (row.amount < 0 && theme.palette.error.main)

            || theme.palette.background.paper
            ,

            row.amount === 0 ? 1 : 0.1),
          cursor: row.collapse ? 'pointer' : 'default'
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
            row.name ?
              <Link underline="none">{row.name}</Link>
              : <Link underline="none">+</Link>

          )}
        </TableCell>
        <TableCell>
          {loading ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <Skeleton width={20} height={30} />
              <Skeleton width={100} />
            </Stack>
          ) : (
            row.insurance ?
              <Stack direction='row' alignItems="center" spacing={1}>
                <Image src={`/static/img/${row.insurance.img}.png`} width={20} height={20} alt={row.insurance.name} />
                <Typography variant="body2">{row.insurance.name}</Typography>
              </Stack> :
              <Typography>--</Typography>

          )}
        </TableCell>
        <TableCell>
          {loading ? (

            <Skeleton width={80} />

          ) : (
            row.type ?
              <Typography variant="body2" color="text.primary">{t('table.' + row.type)}</Typography>
              : <Typography>--</Typography>
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

            row.billing_status ?

              <Label className="label" variant="ghost" color={row.billing_status === "yes" ? "success" : 'error'}>{t('table.' + row.billing_status)}</Label>
              : <Typography>--</Typography>
          )}
        </TableCell>
        <TableCell align="center">
          {loading ? (
            <Skeleton width={40} height={20} />

          ) : (
            row.pending ? <Stack direction='row' spacing={2} alignItems="center">
              <Typography color={theme => theme.palette.warning.darker} fontWeight={600}>
                {row.amount}/{row.pending}
              </Typography>
              <IconButton color="primary" onClick={(e) => {
                e.stopPropagation()
                editMotif(row)
              }
              }>
                <Icon path="ic-argent" />
              </IconButton>
            </Stack> :
              <Typography color={(row.amount > 0 && 'success.main' || row.amount < 0 && 'error.main') || 'text.primary'} fontWeight={700}>{row.amount}</Typography>

          )}
        </TableCell>
      </TableRowStyled>
      {
        row.collapse &&
        <TableRow >
          <TableCell colSpan={9} style={{
            backgroundColor: 'transparent',
            border: 'none',
            borderTop: 'none',
            borderBottom: 'none',
            padding: 0,
            lineHeight: 0,
          }}>
            <Collapse in={isItemSelected} timeout="auto" unmountOnExit sx={{ pl: 6 }}>
              <Table>
                {
                  row.collapse.map((col: any, idx: number) => {
                    return <TableRow hover
                      onClick={() => handleChildSelect(col)}
                      role="checkbox"
                      key={idx}
                      className="collapse-row"
                      sx={{
                        bgcolor: (theme: Theme) => theme.palette.background.paper
                      }}
                    >
                      <TableCell style={{ backgroundColor: 'transparent', border: 'none' }} padding="checkbox">
                        {loading ? (
                          <Skeleton variant="circular" width={28} height={28} />
                        ) : (
                          <Checkbox
                            color="primary"
                            checked={selected.some((item: any) => item.uuid === col.uuid)}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell style={{ backgroundColor: 'transparent', border: 'none', }}>
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
                            <Typography variant="body2">{col.date}</Typography>
                          </Stack>

                        )}
                      </TableCell>
                      <TableCell style={{ backgroundColor: 'transparent', border: 'none', }}>
                        {loading ? (
                          <Stack direction="row" spacing={1} alignItems="left">
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
                      <TableCell style={{ backgroundColor: 'transparent', border: 'none', }}>
                        {loading ? (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Skeleton width={20} height={30} />
                            <Skeleton width={20} height={30} />

                          </Stack>
                        ) : (
                          <Stack direction='row' alignItems="center" justifyContent='flex-start' spacing={1}>
                            {
                              col.payment_type.map((type: any, i: number) =>
                                <Stack key={i} direction="row" alignItems="center" spacing={1}>
                                  <Icon path={type.icon} />
                                  <Typography color="text.primary" variant="body2">{t("table." + type.name)}</Typography>
                                </Stack>

                              )
                            }
                          </Stack>

                        )}
                      </TableCell>
                      <TableCell align="left" style={{ backgroundColor: 'transparent', border: 'none', }}>
                        {loading ? (
                          <Skeleton width={40} height={40} />

                        ) : (

                          col.billing_status ?

                            <Label className="label" variant="ghost" color={col.billing_status === "yes" ? "success" : 'error'}>{t('table.' + col.billing_status)}</Label>
                            : <Typography>--</Typography>
                        )}
                      </TableCell>
                      <TableCell style={{ backgroundColor: 'transparent', border: 'none' }}>
                        {loading ? (
                          <Skeleton width={40} height={20} />

                        ) : (
                          <Typography color={(col.amount > 0 && 'success.main' || col.amount < 0 && 'error.main') || 'text.primary'} fontWeight={700}>{col.amount}</Typography>

                        )}
                      </TableCell>
                    </TableRow>

                  })
                }


              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      }
    </>
  );
}
export default PaymentRow;