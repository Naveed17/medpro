import * as React from "react";
// material components
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Checkbox,
  Button,
  IconButton,
} from "@mui/material";

// _________________________________
import Icon from "@themes/urlIcon";
import { Pagination } from "@features/pagination";
import EnhancedTableHead from "./tableHead";
import { DataProp } from "@interfaces/PatientList";
import { useTranslation } from "next-i18next";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
  ) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<DataProp>(
  array: any[],
  comparator: (a: DataProp, b: DataProp) => number
) {
  const stabilizedThis = array.map(
    (el, index) => [el, index] as [DataProp, number]
  );
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function PatiendData({ ...props }) {
  const { PatiendData } = props;
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof DataProp>("name");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const { t, ready } = useTranslation("patient");
  if (!ready) return <>loading translations...</>;
  const rowsPerPage = 10;
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof DataProp
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = PatiendData.map((n: { name: string }) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

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

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <TableContainer sx={{ maxHeight: `calc(100vh - 220px)` }}>
          <Table
            sx={{ minWidth: 1260 }}
            size={"medium"}
            stickyHeader
            aria-label="sticky table"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order as Order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={PatiendData.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(PatiendData, getComparator(order as Order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  const isItemSelected = isSelected(row.name as string);
                  const labelId = `enhanced-table-checkbox-${i}`;

                  return (
                    <TableRow
                      hover
                      onClick={() => handleClick(row.name as string)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={Math.random()}
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
                            src={row.avatar as string}
                            className="avatar"
                            alt="avatar"
                            height="28px"
                            width={28}
                          />
                          <Box ml={1}>
                            <Typography
                              variant="body1"
                              component="span"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                svg: { mr: 0.5 },
                              }}
                              color="primary"
                            >
                              <Icon path={"ic-f"} />
                              {row.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              component="span"
                              color="text.secondary"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                svg: { mr: 0.5 },
                              }}
                            >
                              <Icon path="ic-anniverssaire" />
                              {/* {new Date(row.time).toLocaleDateString()} - 32 Ans */}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          display="flex"
                          component="span"
                          alignItems="center"
                        >
                          <Icon path="ic-tel" />
                          <Typography sx={{ ml: 0.6 }}>
                            {row.telephone}
                          </Typography>
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
                          >
                            {t("table.body.add-appointment")}
                          </Button>
                        ) : (
                          <Box display="flex" alignItems="center">
                            <IconButton size="small">
                              <Icon path="ic-historique" />
                            </IconButton>
                            <Box ml={1}>
                              <Typography
                                component="span"
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
                                <Icon path="ic-agenda" />
                                {/* {new Date(
                                  row.nextAppointment
                                ).toLocaleDateString()} */}
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
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                <Icon path="ic-time" />
                                {/* {new Date(row.time).toLocaleDateString()} */}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <IconButton size="small">
                            <Icon path="ic-historique" />
                          </IconButton>
                          <Box ml={1}>
                            <Typography
                              component="span"
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
                              <Icon path="ic-agenda" />
                              {/* {new Date(
                                row.nextAppointment
                              ).toLocaleDateString()} */}
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
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              <Icon path="ic-time" />
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
                          <Icon path="ic-autre2" />
                        </IconButton>

                        <Button
                          size="small"
                          sx={{
                            ml: 0.6,
                            color: "#000",
                            path: { fill: "#000" },
                          }}
                        >
                          {t("table.body.edit")}
                        </Button>

                        <Button size="small">{t("table.body.see-card")}</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box py={1} />
        <Pagination
          page={page}
          total={PatiendData.length}
          count={(PatiendData.length / rowsPerPage + 1).toFixed(0)}
          setPage={(v: number) => setPage(v)}
        />
      </Box>
    </Box>
  );
}

export default PatiendData;
