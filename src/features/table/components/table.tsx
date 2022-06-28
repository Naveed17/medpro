import {SetStateAction, useEffect, useState} from "react";
import * as React from "react";
import {Box, TableBody, TableContainer, Table} from "@mui/material";
import OHead from "@features/table/components/header";
import rowsActionsData from "@features/table/components/config";

function descendingComparator(a: { [x: string]: number; }, b: { [x: string]: number; }, orderBy: string | number) {

    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order: string, orderBy: string) {
    return order === 'desc'
        ? (a: { [x: string]: number; }, b: { [x: string]: number; }) => descendingComparator(a, b, orderBy)
        : (a: { [x: string]: number; }, b: { [x: string]: number; }) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: any[], comparator: { (a: { [x: string]: number; }, b: { [x: string]: number; }): number; (arg0: any, arg1: any): any; }) {
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

function Otable({...props}) {
    const {rows, headers, state, handleChange, t, from, edit, handleConfig} = props;

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [tableHeadData, setTableHeadData] = useState<any>(null);
    const [active, setActive] = useState([]);

    const handleRequestSort = (event: any, property: SetStateAction<string>) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const selectted = rowsActionsData.find((item) =>
        from === item.action
    );

    const Component: any = selectted?.component;

    // Avoid a layout jump when reaching the last page with empty rows.
    const ids = rows.map((row: any) => row.id);
    useEffect(() => {
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
                    <OHead
                        order={order}
                        orderBy={orderBy}
                        state={state}
                        handleConfig={handleConfig}
                        onRequestSort={handleRequestSort}
                        data={headers}
                        getData={(data: any) => setTableHeadData(data)}/>

                    <TableBody>
                        {
                            stableSort(rows, getComparator(order, orderBy))
                                .map((row, index) => {
                                    return (
                                        <Component key={index}
                                                   row={row}
                                                   t={t}
                                                   tableHeadData={state}
                                                   handleChange={handleChange}
                                                   editMotif={edit}
                                                   active={active}
                                                   ids={ids}/>
                                    )

                                })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
export default Otable