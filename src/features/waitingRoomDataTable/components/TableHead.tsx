import * as React from 'react';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import CodeIcon from '@mui/icons-material/Code';
import { TableHead } from '@mui/material';
import { useTranslation } from 'next-i18next';
const headCells = [
    {
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: 'Id',
        align: 'left',
        sortable: true,
    },
    {
        id: 'time',
        numeric: false,
        disablePadding: true,
        label: "arrival time",
        align: 'left',
        sortable: true,
    },
    {
        id: 'appointmentTime',
        numeric: false,
        disablePadding: true,
        label: "Appointment time",
        align: 'left',
        sortable: false,
    },
    {
        id: 'motif',
        numeric: false,
        disablePadding: true,
        label: "Reason",
        align: 'left',
        sortable: false,
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: true,
        label: "Status",
        align: 'left',
        sortable: true,
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: "Patient's name",
        align: 'left',
        sortable: true,
    },
    {
        id: 'agenda',
        numeric: false,
        disablePadding: true,
        label: "Agenda",
        align: 'left',
        sortable: true,
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: true,
        label: "Action",
        align: 'left',
        sortable: false,
    },

];

export default function TableHeadSimple({ ...props }) {
    const { order, orderBy, onRequestSort, translate } = props;

    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);

    };
    const { t, ready } = translate;
    if (!ready) return (<>loading translations...</>);
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            {...(headCell.sortable && { onClick: createSortHandler(headCell.id) })}
                            IconComponent={headCell.sortable ? CodeIcon : undefined}
                            sx={{
                                justifyContent: headCell.align === "center" ? 'center !important' : headCell.align === 'right' ? "flex-start !important" : 'flex-end !important',
                            }}
                        >
                            {t(headCell.label)}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}

                        </TableSortLabel>


                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

