import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import IconButton from "@mui/material/IconButton";
// utils
import Icon from "@themes/urlIcon";
import data from "./data.json";
const { tableData } = data;
// import BasicPagination from "@components/pagination";
// import useSettings from "@settings/useSettings";

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
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
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
const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Patient's name",
  },
  {
    id: "telephone",
    numeric: true,
    disablePadding: false,
    label: "Telephone",
  },
  {
    id: "city",
    numeric: false,
    disablePadding: false,
    label: "City",
  },
  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "nextappointment",
    numeric: false,
    disablePadding: false,
    label: "Next Appointment",
  },
  {
    id: "lastappointment",
    numeric: false,
    disablePadding: false,
    label: "Last appointment",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Action",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.id === "action" ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function PatientTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(0);
  // const router = useRouter();
  //   const settings = useSettings();
  //   const {
  //     ModalType,
  //     modalSet,
  //     modalDataSet,
  //     popupSet,
  //     popupDataSet,
  //     popupTypeSet,
  //     // sideBarDataSet,
  //     actionRightSet,
  //   } = settings;

  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (event: EventTarget, property: string) => {
    const isAsc: boolean = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds: string[] = tableData.map((n) => n.name);
      setSelected(newSelecteds);

      return;
    }

    setSelected([]);
  };

  const handleClick = (name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ height: `calc(100vh - 160px)`, overflow: "auto" }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 1260 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={tableData.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(tableData, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any, index: number) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={() => handleClick(row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          display="flex"
                          alignItems="center"
                          sx={{ img: { borderRadius: "4px" } }}
                        >
                          <img
                            src={row.avatar}
                            className="avatar"
                            alt="avatar"
                            height="28px"
                            width={28}
                          />
                          <Box ml={1}>
                            <Typography
                              variant="body1"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                svg: { mr: 0.5 },
                              }}
                              color="primary"
                            >
                              {/* <Icon path={"ic-f"} /> */}
                              {row.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                svg: { mr: 0.5 },
                              }}
                            >
                              {/* <Icon path="ic-anniverssaire" /> */}
                              {new Date(row.time).toLocaleDateString()} - 32 Ans
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {/* <Icon path="ic-tel" /> */}
                          <Typography sx={{ ml: 0.6 }}>{row.phone}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{row.city}</TableCell>
                      <TableCell>{row.idCode}</TableCell>
                      <TableCell>
                        {row.addAppointment ? (
                          <Button
                            variant="text"
                            size="small"
                            color="primary"
                            startIcon={<Icon path="ic-agenda-+" />}
                            sx={{ position: "relative", zIndex: 1000 }}
                            // onClick={() => (
                            //   modalSet(true),
                            //   ModalType("MOVE_APOINT_MODAL"),
                            //   modalDataSet(row)
                            // )}
                          >
                            Add Apointment
                          </Button>
                        ) : (
                          <Box display="flex" alignItems="center">
                            <IconButton
                              size="small"
                              //   onClick={() => (
                              //     modalSet(true),
                              //     ModalType("ADD_APOINT_MODAL"),
                              //     modalDataSet(row)
                              //   )}
                            >
                              {/* <Icon path="ic-historique" /> */}
                            </IconButton>
                            <Box ml={1}>
                              <Typography
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  "& svg": {
                                    width: 11,
                                    mr: 0.6,
                                    "& path": { fill: "#1b2746" },
                                  },
                                }}
                                variant="body2"
                                color="text.primary"
                              >
                                {/* <Icon path="ic-agenda" /> */}
                                {new Date(
                                  row.nextAppointment
                                ).toLocaleDateString()}
                              </Typography>
                              <Typography
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  "& svg": {
                                    width: 11,
                                    mr: 0.6,
                                  },
                                }}
                                variant="body2"
                                color="text.primary"
                              >
                                {/* <Icon path="ic-time" /> */}
                                {new Date(row.time).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {/* <IconButton
                          size="small"
                          onClick={() => (
                            modalSet(true),
                            ModalType("MOVE_APOINT_MODAL"),
                            modalDataSet(row)
                          )}
                        >
                          <Icon path="ic-historique" />
                        </IconButton> */}
                          <Box ml={1}>
                            <Typography
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                "& svg": {
                                  width: 11,
                                  mr: 0.6,
                                  "& path": { fill: "#1b2746" },
                                },
                              }}
                              variant="body2"
                              color="text.primary"
                            >
                              {/* <Icon path="ic-agenda" width="11px" /> */}
                              {new Date(
                                row.nextAppointment
                              ).toLocaleDateString()}
                            </Typography>
                            <Typography
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                "& svg": {
                                  width: 11,
                                  mr: 0.6,
                                },
                              }}
                              variant="body2"
                              color="text.primary"
                            >
                              {/* <Icon path="ic-time" /> */}
                              {new Date(row.time).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          minHeight: "58.85px",
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{ ml: 0.6, path: { fill: "#000" } }}
                        >
                          {/* <Icon path="ic-autre2" /> */}
                        </IconButton>

                        <Button
                          size="small"
                          startIcon={<Icon path="setting/edit" />}
                          //   onClick={() => (
                          //     popupSet(true),
                          //     popupDataSet(row),
                          //     popupTypeSet("EDIT_PATIENT")
                          //   )}
                          sx={{
                            ml: 0.6,
                            color: "#000",
                            path: { fill: "#000" },
                          }}
                        >
                          Modifier
                        </Button>

                        <Button
                          size="small"
                          startIcon={<Icon path="ic-voir" />}
                          //   onClick={() => (
                          //     popupSet(true),
                          //     popupDataSet(row),
                          //     popupTypeSet("PATIENT_DETAILS")
                          //   )}
                        >
                          Voir fiche
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box py={1} />
        {/* <BasicPagination /> */}
      </Box>
      {/* <RightAction open={selected.length > 0} /> */}
      {/* <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </Box>
  );
}

export default PatientTable;
