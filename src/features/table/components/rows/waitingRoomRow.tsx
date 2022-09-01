import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import {Button, IconButton, TableCell, Skeleton, Stack, DialogActions} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {Label} from "@features/label";
import {Dialog} from "@features/dialog";
import Icon from "@themes/urlIcon";
import {useState} from 'react'
import CloseIcon from "@mui/icons-material/Close";
import CircleIcon from '@mui/icons-material/Circle';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';

function WaitingRoomRow({...props}) {
    const {row, t} = props;
    const theme = useTheme();
    const [info, setInfo] = useState<null | string>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [actions, setActions] = useState<boolean>(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInfo(null)
    }

    const handleClick = (action: number) => {
        switch (action) {
            case 1:
                setInfo("end_consultation");
                setOpenDialog(true);
                setActions(false)
                break;
            case 2:
                setInfo("secretary_consultation_alert");
                setOpenDialog(true);
                setActions(true)
                break;
            default:
                setInfo(null)
                break;

        }

    };

    function DialogAction() {
        return (
            <DialogActions>
                <Button onClick={handleCloseDialog}
                        startIcon={<CloseIcon/>}>
                    {t('table.cancel')}
                </Button>
                <Button variant="contained"
                        onClick={handleCloseDialog}
                        startIcon={<Icon
                            path='ic-check'/>}>
                    {t('table.end_consultation')}
                </Button>
            </DialogActions>
        )
    }

    return (
        <>
            <TableRow key={Math.random()}>
                <TableCell>
                    {row ? (
                        <Box display="flex" alignItems="center">
                            <Typography color="text.primary" sx={{ml: 0.6}}>
                                {row.id}
                            </Typography>
                        </Box>
                    ) : (
                        <Skeleton variant="text" width={50}/>
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
                                        path: {fill: theme.palette.success.main},
                                    },
                                }}
                            >
                                <Icon path="ic-time"/>
                                {row.arrivaltime}
                            </Typography>
                        </Box>
                    ) : (
                        <Skeleton variant="text" width={80}/>
                    )}
                </TableCell>
                <TableCell>
                    {row ? (
                        <Box
                            display="flex"
                            alignItems="center"
                            sx={{
                                svg: {
                                    path: {fill: theme.palette.text.secondary},
                                },
                            }}
                        >
                            <Icon path="ic-time"/>
                            <Typography color="success" sx={{ml: 0.6}}>
                                {row.appointmentTime}
                            </Typography>
                        </Box>
                    ) : (
                        <Skeleton variant="text" width={80}/>
                    )}
                </TableCell>
                <TableCell
                    sx={{
                        my: 1,
                    }}
                >
                    {row ? (
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Box
                                display="flex"
                                alignItems="center"
                                sx={{
                                    svg: {
                                        path: {fill: theme.palette.text.secondary},
                                    },
                                }}
                            >
                                <Icon path="ic-time"/>
                                <Typography color="success" sx={{ml: 0.6}}>
                                    {row.waiting} {t("table.min")}
                                </Typography>
                            </Box>
                        </Box>
                    ) : (
                        <Stack direction="row" justifyContent="space-between">
                            <Skeleton variant="text" width={150}/>
                            <Skeleton variant="text" width={80}/>
                        </Stack>
                    )}
                </TableCell>
                <TableCell
                    sx={{
                        my: 1,
                    }}
                >
                    {row ? (
                        <Stack direction="row"
                               alignItems="center"
                               spacing={1}
                        >
                            <CircleIcon fontSize="small" sx={{
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: '50%',
                                p: 0.2,
                            }}
                                        color='primary'
                            />
                            <Typography color="primary">
                                {row.reson}
                            </Typography>
                        </Stack>
                    ) : (
                        <Stack direction="row" justifyContent="space-between">
                            <Skeleton variant="text" width={150}/>
                            <Skeleton variant="text" width={80}/>
                        </Stack>
                    )}
                </TableCell>
                <TableCell>
                    {row ? (
                        <Box display="flex" alignItems="center">
                            <Typography color="text.primary" sx={{ml: 0.6}}>
                                {row.patient}
                            </Typography>
                        </Box>
                    ) : (
                        <Skeleton variant="text" width={100}/>
                    )}
                </TableCell>
                <TableCell>
                    {row ? (
                        <Stack spacing={2} direction="row" alignItems="center">
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
                            <PlayCircleRoundedIcon color="success"/>
                            <Typography variant="body2">
                                120 TND
                            </Typography>
                        </Stack>
                    ) : (
                        <Skeleton variant="text" width={100}/>
                    )}
                </TableCell>
                <TableCell align="right">
                    {row ? (
                        <Box display="flex" sx={{float: "right"}} alignItems="center">
                            <IconButton
                                onClick={() => handleClick(row.id)}
                                size="small">
                                <Icon path="more-vert"/>
                            </IconButton>
                        </Box>
                    ) : (
                        <Skeleton variant="text" width={100}/>
                    )}
                </TableCell>
            </TableRow>
            {info &&
                <Dialog action={info}
                        open={openDialog}
                        data={null}
                        change={false}
                        size={"lg"}
                        color={info === "secretary_consultation_alert" && theme.palette.error.main}
                        direction={'ltr'}
                        title={t("table.end_consultation")}
                        dialogClose={handleCloseDialog}
                        onClose={handleCloseDialog}
                        {
                            ...(actions && {
                                actionDialog: <DialogAction/>,
                                onClose: false,
                            })
                        }

                />
            }
        </>
    );
}

export default WaitingRoomRow;
