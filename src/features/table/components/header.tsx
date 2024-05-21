import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import {Checkbox} from "@mui/material";
import {visuallyHidden} from "@mui/utils";
import CodeIcon from "@mui/icons-material/Code";
import {capitalize} from 'lodash'

function OHead({...props}) {
    const {
        order,
        orderBy,
        onRequestSort,
        data,
        t,
        prefix = null,
        numSelected,
        hideHeaderOnMobile,
        rowCount,
        onSelectAllClick,
    } = props;
    const createSortHandler = (property: any) => (event: any) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead
            className={hideHeaderOnMobile ? "sm-none" : ""}
            sx={{
                display: {
                    md: "table-header-group",
                    xs: hideHeaderOnMobile ? "none" : "table-header-group",
                },
            }}
        >
            <TableRow>
                {data.map((headCell: any) => (
                    <React.Fragment key={headCell.id}>
                        {headCell.id === "select-all" ? (
                            <TableCell padding="checkbox">
                                <Checkbox
                                    size="small"
                                    color="primary"
                                    indeterminate={numSelected > 0 && numSelected < rowCount}
                                    checked={rowCount > 0 && numSelected === rowCount}
                                    onChange={onSelectAllClick}
                                    inputProps={{
                                        "aria-label": "select all desserts",
                                    }}
                                />
                            </TableCell>
                        ) : (
                            <TableCell
                                key={headCell.id}
                                align={headCell.align}
                                padding={headCell.disablePadding ? "none" : "normal"}
                                sortDirection={orderBy === headCell.id ? order : false}>
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : "asc"}
                                    {...(headCell.sortable && {
                                        onClick: createSortHandler(headCell.id),
                                    })}
                                    IconComponent={headCell.sortable ? CodeIcon : null}
                                    sx={{
                                        fontWeight: 500,
                                        justifyContent:
                                            headCell.align === "center"
                                                ? "center !important"
                                                : "flex-start",
                                    }}>
                                    {headCell.label !== "empty" && capitalize(t(`${prefix ? `${prefix}.` : ""}table.${headCell.label}`))}
                                    {orderBy === headCell.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === "desc"
                                                ? "sorted descending"
                                                : "sorted ascending"}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                            </TableCell>
                        )}
                    </React.Fragment>
                ))}
            </TableRow>
        </TableHead>
    );
}

OHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
};

export default OHead;
