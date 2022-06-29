import * as React from 'react';
import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import {Button, TableCell} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {Label} from "@features/label";
import Icon from "@themes/urlIcon";

function WaitingRoomRow({...props}) {

    const {row, t} = props;
    const theme = useTheme();
    return (
        <TableRow key={Math.random()}>
            <TableCell>
                <Box display="flex" alignItems="center">
                    <Typography color="text.primary" sx={{ml: 0.6}}>
                        {row.id}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell>
                <Box display="flex" alignItems="center">
                    <Typography
                        component={'span'}
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
            </TableCell>
            <TableCell>
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
            </TableCell>
            <TableCell
                sx={{
                    my: 1,
                    borderLeft: `4px solid ${row.status === "completed"
                        ? theme.palette.success.main
                        : row.status === "canceled"
                            ? theme.palette.error.main
                            : row.status === "success"
                                ? theme.palette.success.main
                                : theme.palette.primary.main
                    }`,
                }}
            >
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
                            '& .react-svg svg': {
                                width: 15,
                            }
                        }}
                        startIcon={
                            row.type === "cabinet" ? <Icon path="ic-cabinet"/> :
                                row.type === "teleconsultation" ? <Icon path="ic-video-red"/>
                                    :
                                    null

                        }
                    >
                        {t(row.reson)}
                    </Button>
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
                            {row.duration} {t("min")}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>
            <TableCell>
                <Label
                    variant="filled"
                    color={row.status === "completed" ? "success" : row.status === "canceled" ? "error" : "primary"}
                    sx={{color: theme.palette.text.primary, width: "100%"}}
                >
                    {t(row.status)}
                </Label>
            </TableCell>
            <TableCell>
                <Box display="flex" alignItems="center">
                    <Typography color="text.primary" sx={{ml: 0.6}}>
                        {row.patient}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell>
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                        svg: {
                            path: {fill: theme.palette.text.secondary},
                        },
                    }}
                >
                    <Icon path="ic-agenda-dark"/>
                    <Typography color="text.secondary" sx={{ml: 0.6}}>
                        {row.agenda}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell align="right">
                <Box display="flex" sx={{float: "right"}} alignItems="center">
                    <Button variant="text" size="small" color="primary">
                        {t("See details")}
                    </Button>
                </Box>
            </TableCell>
        </TableRow>
    )
}

export default WaitingRoomRow

