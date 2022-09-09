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

function OHead({...props}) {
    const {
        order,
        orderBy,
        onRequestSort,
        data,
        handleConfig,
        t,
        numSelected,
        hideHeaderOnMobile,
        rowCount,
        onSelectAllClick,
    } = props;
    const createSortHandler = (property: any) => (event: any) => {
        onRequestSort(event, property);
    };

    const handleChange = (value: string | boolean, event: any) => {
        handleConfig(value, event);
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
                                sortDirection={orderBy === headCell.id ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : "asc"}
                                    {...(headCell.sortable && {
                                        onClick: createSortHandler(headCell.id),
                                    })}
                                    IconComponent={headCell.sortable ? CodeIcon : null}
                                    sx={{
                                        justifyContent:
                                            headCell.align === "center"
                                                ? "center !important"
                                                : "flex-start",
                                    }}
                                >
                                    {t(`table.${headCell.label}`)}
                                    {orderBy === headCell.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === "desc"
                                                ? "sorted descending"
                                                : "sorted ascending"}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                                {/*{headCell.id === "duration" && (
                  <Stack direction="row" width={1} ml={2}>
                    <Checkbox
                      checked={state?.duration}
                      onChange={(e) => {
                        handleChange(e.target.checked, headCell.id);
                      }}
                      inputProps={{ "aria-label": "controlled" }}
                      size="small"
                      name="durationEnable"
                    />
                    <TextField
                      id="outlined-select-currency-native"
                      select
                      size="small"
                      fullWidth
                      value={state && state[headCell.id]}
                      name={headCell.id}
                      //onChange={handleChange}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value={10}>10 min</option>
                      <option value={20}>20 min</option>
                      <option value={30}>30 min</option>
                    </TextField>
                  </Stack>
                )}*/}
                                {/*{(headCell.id === "delay_min" ||
                    headCell.id === "delay_max" ||
                    headCell.id === "isEnabled") && (
                    <Switch
                        checked={Boolean(state && state[headCell.id])}
                        name={headCell.id}
                        onChange={(e) => {
                          handleChange(e.target.value, headCell.id);
                        }}
                        inputProps={{"aria-label": "controlled"}}
                        sx={{m: headCell.id === "isEnabled" ? "auto" : 0}}
                    />
                )}*/}
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
