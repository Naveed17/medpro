import * as React from 'react';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import CodeIcon from '@mui/icons-material/Code';
const RootStyle = styled(TableHead)(({ theme }) => ({
    '& .MuiTableCell-head': {
        paddingTop: '8px !important',
        paddingBottom: '8px !important',
    },
    '& .MuiTableSortLabel-root': {
        '& .MuiTableSortLabel-icon': {
            transform: 'rotate(90deg)',
        }
    }
}));
const headCells = [
    {
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: 'ID',
        align: 'left',
        sortable: true,
    },
    {
        id: 'time',
        numeric: false,
        disablePadding: true,
        label: "heure d'arrivée",
        align: 'left',
        sortable: true,
    },
    {
        id: 'appointmentTime',
        numeric: false,
        disablePadding: true,
        label: "Heure du RDV",
        align: 'left',
        sortable: false,
    },
    {
        id: 'motif',
        numeric: false,
        disablePadding: true,
        label: "Motif",
        align: 'left',
        sortable: false,
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: true,
        label: "Statut",
        align: 'left',
        sortable: true,
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: "nom du patient",
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
export default function TableHeadSimple(props) {
    const { order, orderBy, onRequestSort, } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    return (
        <RootStyle >
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

                            IconComponent={headCell.sortable ? CodeIcon : null}
                            sx={{
                                justifyContent: headCell.align === "center" ? 'center !important' : headCell.align === 'right' ? "flex-start !important" : 'flex-end !important',
                            }}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}

                        </TableSortLabel>


                    </TableCell>
                ))}
            </TableRow>
        </RootStyle>
    );
}

