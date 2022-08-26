import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Button, TableCell, Skeleton, Stack, DialogActions } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Label } from "@features/label";
import { Dialog } from "@features/dialog";
import Icon from "@themes/urlIcon";
import { useState } from 'react'
import CloseIcon from "@mui/icons-material/Close";
function WaitingRoomRow({ ...props }) {
  const { row, t } = props;
  const theme = useTheme();
  const [info, setInfo] = useState<null | string>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setInfo(null)
  }
  const handleClick = (action: number) => {
    switch (action) {
      case 1:
        setInfo("end_consultation");
        setOpenDialog(true)
        break;
      default:
        setInfo(null)
        break;

    }

  };
  return (
    <>
      <TableRow key={Math.random()}>
        <TableCell>
          {row ? (
            <Box display="flex" alignItems="center">
              <Typography color="text.primary" sx={{ ml: 0.6 }}>
                {row.id}
              </Typography>
            </Box>
          ) : (
            <Skeleton variant="text" width={50} />
          )}
        </TableCell>
        <TableCell>
          {row ? (
            <Box display="flex" alignItems="center">
              <Typography
                component={"span"}
                sx={{
                  mt: 1,
                  display: "flex",
                  alignItems: "center",
                  color: theme.palette.success.main,
                  svg: {
                    width: 11,
                    mx: 0.5,
                    path: { fill: theme.palette.success.main },
                  },
                }}
              >
                <Icon path="ic-time" />
                {row.arrivaltime}
              </Typography>
            </Box>
          ) : (
            <Skeleton variant="text" width={80} />
          )}
        </TableCell>
        <TableCell>
          {row ? (
            <Box
              display="flex"
              alignItems="center"
              sx={{
                svg: {
                  path: { fill: theme.palette.text.secondary },
                },
              }}
            >
              <Icon path="ic-time" />
              <Typography color="success" sx={{ ml: 0.6 }}>
                {row.appointmentTime}
              </Typography>
            </Box>
          ) : (
            <Skeleton variant="text" width={80} />
          )}
        </TableCell>
        <TableCell
          sx={{
            my: 1,
            borderLeft: `4px solid ${row?.status === "completed"
              ? theme.palette.success.main
              : row?.status === "canceled"
                ? theme.palette.error.main
                : row?.status === "success"
                  ? theme.palette.success.main
                  : theme.palette.primary.main
              }`,
          }}
        >
          {row ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                variant="text"
                size="small"
                color="primary"
                sx={{
                  "& .react-svg svg": {
                    width: 15,
                  },
                }}
                startIcon={
                  row?.type === "cabinet" ? (
                    <Icon path="ic-cabinet" />
                  ) : row.type === "teleconsultation" ? (
                    <Icon path="ic-video-red" />
                  ) : null
                }
              >
                {t(`table.${row.reson}`)}
              </Button>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  svg: {
                    path: { fill: theme.palette.text.secondary },
                  },
                }}
              >
                <Icon path="ic-time" />
                <Typography color="success" sx={{ ml: 0.6 }}>
                  {row.duration} {t("table.min")}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Stack direction="row" justifyContent="space-between">
              <Skeleton variant="text" width={150} />
              <Skeleton variant="text" width={80} />
            </Stack>
          )}
        </TableCell>
        <TableCell>
          {row ? (
            <Label
              variant="filled"
              color={
                row?.status === "completed"
                  ? "success"
                  : row?.status === "canceled"
                    ? "error"
                    : "primary"
              }
            >
              {t(`table.${row.status}`)}
            </Label>
          ) : (
            <Skeleton variant="text" width={100} />
          )}
        </TableCell>
        <TableCell>
          {row ? (
            <Box display="flex" alignItems="center">
              <Typography color="text.primary" sx={{ ml: 0.6 }}>
                {row.patient}
              </Typography>
            </Box>
          ) : (
            <Skeleton variant="text" width={100} />
          )}
        </TableCell>
        <TableCell>
          {row ? (
            <Box
              display="flex"
              alignItems="center"
              sx={{
                svg: {
                  path: { fill: theme.palette.text.secondary },
                },
              }}
            >
              <Icon path="ic-agenda-dark" />
              <Typography color="text.secondary" sx={{ ml: 0.6 }}>
                {row.agenda}
              </Typography>
            </Box>
          ) : (
            <Skeleton variant="text" width={100} />
          )}
        </TableCell>
        <TableCell align="right">
          {row ? (
            <Box display="flex" sx={{ float: "right" }} alignItems="center">
              <Button
                onClick={() => handleClick(row.id)}
                variant="text" size="small" color="primary">
                {t("table.See details")}
              </Button>
            </Box>
          ) : (
            <Skeleton variant="text" width={100} />
          )}
        </TableCell>
      </TableRow>
      {info &&
        <Dialog action={info}
          open={openDialog}
          data={null}
          change={false}
          max
          direction={'ltr'}
          actions={true}
          title={t("table." + info)}
          dialogClose={handleCloseDialog}
          onClose={handleCloseDialog}
          actionDialog={
            <DialogActions>
              <Button onClick={handleCloseDialog}
                startIcon={<CloseIcon />}>
                {t('table.cancel')}
              </Button>
              <Button variant="contained"
                onClick={handleCloseDialog}
                startIcon={<Icon
                  path='ic-dowlaodfile' />}>
                {t('tabel.save')}
              </Button>
            </DialogActions>
          } />
      }
    </>
  );
}

export default WaitingRoomRow;
