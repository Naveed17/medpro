import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from './TableHead';
import LieuxRow from "@themes/overrides/LieuxRow";
import EnhancedTableRow from "@themes/overrides/MotifRow";

function descendingComparator(a, b, orderBy) {

    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export default function MedTable(
    {
        rows,
        headers,
        state,
        from,
        t,
        handleConfig,
        handleChange,
        editMotif,
        ...rest
    }) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [tableHeadData, setTableHeadData] = React.useState(null);
    const [active, setActive] = React.useState([]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const ids = rows.map((row) => row.id);
    React.useEffect(() => {
        if (tableHeadData !== null) {
            if (tableHeadData.active) {
                setActive(ids);
            } else {
                setActive([]);
            }
        }

    }, [tableHeadData?.active])
    return (
        <Box>
            <TableContainer>
                <Table
                    sx={{minWidth: 750}}
                    aria-labelledby="tableTitle"
                    size={'medium'}>
                    <TableHead
                        order={order}
                        orderBy={orderBy}
                        state={state}
                        handleConfig={handleConfig}
                        onRequestSort={handleRequestSort}
                        data={headers}
                        getData={(data) => setTableHeadData(data)}
                    />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .map((row, index) => {
                                if (from === 'motif') {
                                    return (<EnhancedTableRow key={index}
                                                              row={row}
                                                              tableHeadData={state}
                                                              handleChange={handleChange}
                                                              editMotif={editMotif}
                                                              active={active}
                                                              ids={ids}/>)
                                } else
                                    return (<LieuxRow key={index}
                                                      row={row}
                                                      tableHeadData={state}
                                                      handleChange={handleChange}
                                                      editMotif={editMotif}
                                                      t={t}
                                                      active={active}
                                                      ids={ids}/>
                                    );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
