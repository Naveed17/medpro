import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from './TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Button, TableCell } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Label } from "@features/label";
import Icon from "@themes/urlIcon";
import config from './config.json';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
        a: { [key in Key]: number | string },
        b: { [key in Key]: number | string },
    ) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}


function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
export default function EnhancedTable() {
    const theme = useTheme();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('patient');
    const handleRequestSort = (event: React.MouseEvent<unknown>
        , property: (string | any)) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const { rows } = config;
    return (
        <Box>
            <TableContainer>
                <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={'medium'}
                >
                    <TableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {stableSort(rows, getComparator(order as Order, orderBy)).map((row) => (
                            <TableRow key={Math.random()}>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <Typography color="text.primary" sx={{ ml: 0.6 }}>
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
                                                    path: { fill: theme.palette.success.main },
                                                },
                                            }}
                                        >
                                            <Icon path="ic-time" />
                                            {row.time}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
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
                                            {row.time1}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        my: 1,
                                        borderLeft: `4px solid ${row.status === "warning"
                                            ? theme.palette.warning.main
                                            : row.status === "error"
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
                                            startIcon={
                                                row.btn === "Video consultation" ? (
                                                    <Icon path="ic-video-red" />
                                                ) : (
                                                    ""
                                                )
                                            }
                                        >
                                            {row.btn}
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
                                                {row.time2}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Label
                                        variant="filled"
                                        color='primary'
                                        sx={{ color: "#000", width: "100%" }}
                                    >
                                        {row.label}
                                    </Label>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <Typography color="text.primary" sx={{ ml: 0.6 }}>
                                            {row.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
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
                                            {row.aganda}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Box display="flex" sx={{ float: "right" }} alignItems="center">
                                        <Button variant="text" size="small" color="primary">
                                            See details
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>

        </Box>
    );
}
