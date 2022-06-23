import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import CodeIcon from '@mui/icons-material/Code';
const RootStyle = styled(TableHead)(({ theme }) => ({
    '& .MuiTableSortLabel-root': {
        '& .MuiTableSortLabel-icon': {
            transform: 'rotate(90deg)',
        }
    }
}));

export default function TableHeadSimple(props) {
    const { order, orderBy, onRequestSort, data } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    return (
        <RootStyle >
            <TableRow>
                {data.map((headCell) => (
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

TableHeadSimple.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};