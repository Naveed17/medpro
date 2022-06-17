import * as React from "react";

// material component
import {
  Box,
  TableCell,
  TableRow,
  TableSortLabel,
  Checkbox,
  TableHead,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

// material icon
import CodeIcon from "@mui/icons-material/Code";

// inerface
import { DataProp } from "@interfaces/PatientList";

interface HeadCell {
  disablePadding: boolean;
  id: keyof DataProp;
  label: string;
  numeric: boolean;
  isSortable: boolean;
  align: "left" | "right" | "center";
}
type Order = "asc" | "desc";

// head data
const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Patient's name",
    isSortable: true,
    align: "left",
  },
  {
    id: "telephone",
    numeric: true,
    disablePadding: false,
    label: "Telephone",
    isSortable: true,
    align: "left",
  },
  {
    id: "city",
    numeric: false,
    disablePadding: false,
    label: "City",
    isSortable: true,
    align: "left",
  },
  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "ID",
    isSortable: true,
    align: "left",
  },
  {
    id: "nextAppointment",
    numeric: false,
    disablePadding: false,
    label: "Next Appointment",
    isSortable: false,
    align: "left",
  },
  {
    id: "lastAppointment",
    numeric: false,
    disablePadding: false,
    label: "Last appointment",
    isSortable: false,
    align: "left",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Action",
    isSortable: false,
    align: "right",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof DataProp
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof DataProp, isSortable: boolean) =>
    (event: React.MouseEvent<unknown>) => {
      isSortable && onRequestSort(event, property);
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
              onClick={createSortHandler(headCell.id, headCell.isSortable)}
              IconComponent={CodeIcon}
              sx={{
                justifyContent:
                  headCell.align === "center"
                    ? "center !important"
                    : "flex-start!important",
                flexDirection: "row!important",
                svg: {
                  transform: "rotate(90deg)",
                  display: headCell.isSortable ? "block" : "none",
                },
              }}
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
export default EnhancedTableHead;
