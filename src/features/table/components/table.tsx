import { SetStateAction, useEffect, useState } from "react";
import * as React from "react";
import { Box, TableBody, TableContainer, Table } from "@mui/material";
import OHead from "@features/table/components/header";
import rowsActionsData from "@features/table/components/config";
import { Pagination } from "@features/pagination";

function descendingComparator(a: any, b: any, orderBy: any) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = "asc" | "desc";

function getComparator(order: any, orderBy: any) {
    return order === "desc"
        ? (a: any, b: any) => descendingComparator(a, b, orderBy)
        : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: any[], comparator: (arg0: any, arg1: any) => any) {
    const stabilizedThis = array?.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function Otable({ ...props }) {
    const {
        rows,
        headers,
        state,
        handleChange,
        t,
        from,
        select = [],
        edit,
        handleConfig,
        minWidth,
        pagination,
        checkedType,
        handleEvent,
        hideHeaderOnMobile,
        loading,
        totalPages,
        total,
        sx,
        ...rest
    } = props;

    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("calories");
    const [tableHeadData, setTableHeadData] = useState<any>(null);
    const [active, setActive] = useState([]);
    const [selected, setSelected] = React.useState<readonly string[]>(select);
    const handleRequestSort = (event: any, property: SetStateAction<string>) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n: {
                uuid: string;
                id: any
            }) => n.uuid);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };
    const handleClick = (id: any) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };
    const selectted = rowsActionsData.find((item) => from === item.action);

    const Component: any = selectted?.component;
    const isSelected = (id: any) => selected.indexOf(id) !== -1;
    // Avoid a layout jump when reaching the last page with empty rows.
    const ids = rows?.map((row: any) => row.uuid);
    useEffect(() => {
        if (tableHeadData !== null) {
            if (tableHeadData.active) {
                setActive(ids);
            } else {
                setActive([]);
            }
        }
    }, [tableHeadData?.active]); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <Box>
            <TableContainer sx={{ maxHeight: `calc(100vh - 220px)`, }}>
                <Table
                    stickyHeader
                    sx={{ minWidth: minWidth, ...sx }}
                    aria-labelledby="tableTitle"
                    size={"medium"}
                >
                    <OHead
                        order={order}
                        orderBy={orderBy}
                        state={state}
                        t={t}
                        checkedType={checkedType}
                        handleConfig={handleConfig}
                        onRequestSort={handleRequestSort}
                        data={headers}
                        getData={(data: any) => setTableHeadData(data)}
                        onSelectAllClick={handleSelectAllClick}
                        rowCount={rows?.length}
                        numSelected={selected.length}
                        hideHeaderOnMobile={hideHeaderOnMobile}
                    />

                    <TableBody>
                        {(loading
                            ? Array.from(new Array(10))
                            : stableSort(rows, getComparator(order, orderBy))
                        ).map((row, index) => {
                            const isItemSelected = isSelected(row?.uuid as string);
                            const labelId = `enhanced-table-checkbox-${index}`;
                            return (
                                <Component
                                    key={index}
                                    row={row}
                                    t={t}
                                    tableHeadData={state}
                                    handleChange={handleChange}
                                    editMotif={edit}
                                    active={active}
                                    ids={ids}
                                    checkedType={checkedType}
                                    labelId={labelId}
                                    data={rest}
                                    selected={selected}
                                    isItemSelected={isItemSelected}
                                    handleClick={handleClick}
                                    handleEvent={handleEvent}
                                    loading={loading}
                                />
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box py={1} />
            {!loading && pagination && parseInt(totalPages) > 1 && (
                <Pagination total={total} count={totalPages} />
            )}
        </Box>
    );
}

export default Otable;