import * as React from "react";
import {
  TableRow,
  TableCell,
  Stack,
  IconButton,
  Checkbox,
  Button,
  Typography,
  Avatar,
  Box,
  Link,
} from "@mui/material";
// import TableHead from "src/components/Table/TableHeadSimple";
// import { Popover } from "src/components";
import Icon from "@themes/urlIcon";
import { styled } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
const RowStyled = styled(TableRow)(({ theme }) => ({
  "& .MuiAvatar-root": {
    width: 20,
    height: 20,
    borderRadius: 4,
    color: theme.palette.common.white,
    backgroundColor: theme.palette.grey[400],
    fontFamily: theme.typography.fontFamily,
    "& span": {
      fontSize: 9,
    },
  },
  "& .MuiCheckbox-root": {
    padding: 2,
    width: 22,
    height: 22,
    "& .react-svg": {
      " & svg": {
        width: 14,
        height: 14,
      },
    },
  },
  "& .MuiButton-root": {
    padding: theme.spacing(0, 1),
    fontSize: 14,
    minWidth: 0,
    color: theme.palette.text.primary,
    "& .react-svg svg path": {
      fill: theme.palette.text.primary,
    },
    "&:hover": {
      backgroundColor: "transparent",
      boxShadow: "none",
    },
    "&:focus, &:active": {
      backgroundColor: "transparent",
      color: theme.palette.text.primary,
      "& .react-svg svg path": {
        fill: theme.palette.text.primary,
      },
    },
  },
  "& .more-icon-btn": {
    color: theme.palette.text.primary,
  },
  "& .MuiTableCell-root": {
    backgroundColor: "transparent !important",
    borderTop: `1px solid ${theme.palette.divider} !important`,
    borderBottom: `1px solid ${theme.palette.divider} !important`,
    "&:first-of-type": {
      borderLeft: `1px solid ${theme.palette.divider} !important`,
    },
    "&:last-of-type": {
      borderRight: `1px solid ${theme.palette.divider} !important`,
    },
  },
}));

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
    id: "documents",
    numeric: false,
    disablePadding: true,
    label: "Documents",
    align: "left",
    sortable: true,
  },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: true,
    label: "crée le",
    align: "left",
    sortable: true,
  },
  {
    id: "createdBy",
    numeric: false,
    disablePadding: true,
    label: "crée par",
    align: "left",
    sortable: true,
  },
  {
    id: "action",
    numeric: false,
    disablePadding: true,
    label: "Action",
    align: "right",
    sortable: false,
  },
];
export default function EnhancedTable(props) {
  const { checkedType, rows } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const isMobile = useMediaQuery("(max-width:600px)");

  // Avoid a layout jump when reaching the last page with empty rows.
  return (
    <>
      <RowStyled key={row.id}>
        {!isMobile ? (
          <>
            <TableCell>
              <Stack spacing={1} direction="row" alignItems="center">
                <Checkbox
                  checked={checkedType.some((item) => item.type === row.type)}
                  inputProps={{ "aria-label": "controlled" }}
                />
                <Icon
                  path={
                    (row.type === "Ordonnances" && "ic-traitement") ||
                    (row.type === "Analyses" && "ic-analyse") ||
                    (row.type === "Rapport" && "ic-lettre") ||
                    (row.type === "Ordonnance de médicaments" &&
                      "ic-ordonance") ||
                    ""
                  }
                />
                <Box>
                  <Typography color="text.primary" fontWeight={400}>
                    {row?.name}
                  </Typography>
                  <Stack spacing={1} direction="row">
                    {row?.firstName && row?.lastName && (
                      <>
                        <Avatar
                          {...(row.img
                            ? {
                                src: row.img,
                                alt: "",
                                sx: { bgcolor: "transparent" },
                              }
                            : {
                                children: (
                                  <span>
                                    {row?.firstName?.slice(0, 1)}{" "}
                                    {row?.lastName?.slice(0, 1)}
                                  </span>
                                ),
                              })}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={400}
                        >
                          {row?.firstName} {row?.lastName}
                        </Typography>
                      </>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </TableCell>
            <TableCell align="center">{row.createdAt}</TableCell>
            <TableCell align="left">
              {row.createdBy === "Interne" ? (
                <Typography color="text.secondary" fontWeight={400}>
                  {row.createdBy}
                </Typography>
              ) : (
                <>
                  <Link underline="none" href={`/profile/${row.createdBy}`}>
                    {row.createdBy}
                  </Link>
                  <Typography
                    fontSize={10}
                    color="text.secondary"
                    fontWeight={400}
                  >
                    {row?.specialist}
                  </Typography>
                </>
              )}
            </TableCell>
            <TableCell align="right">
              <Stack
                spacing={1}
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Button startIcon={<Icon path={"ic-voir"} />}>Voir</Button>
                {/* <Popover /> */}
              </Stack>
            </TableCell>
          </>
        ) : (
          <>
            <TableCell>
              <Stack spacing={1} direction="row" alignItems="center">
                <Icon
                  path={
                    (row.type === "Ordonnances" && "ic-traitement") ||
                    (row.type === "Analyses" && "ic-analyse") ||
                    (row.type === "Rapport" && "ic-lettre") ||
                    (row.type === "Ordonnance de médicaments" &&
                      "ic-ordonance") ||
                    ""
                  }
                />
                <Box>
                  <Typography color="text.primary" fontWeight={400}>
                    {row?.name}
                  </Typography>
                  <Stack spacing={1} direction="row" alignItems="center">
                    {row?.firstName && row?.lastName && (
                      <>
                        <Avatar
                          {...(row.img
                            ? {
                                src: row.img,
                                alt: "",
                                sx: { bgcolor: "transparent" },
                              }
                            : {
                                children: (
                                  <span>
                                    {row?.firstName?.slice(0, 1)}{" "}
                                    {row?.lastName?.slice(0, 1)}
                                  </span>
                                ),
                              })}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={400}
                        >
                          {row?.firstName} {row?.lastName}
                        </Typography>
                      </>
                    )}
                  </Stack>
                </Box>
              </Stack>
              <Stack mt={1}>
                <Stack spacing={1} direction="row">
                  <Icon path="ic-agenda-jour" />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={400}
                  >
                    {row.createdAt}
                  </Typography>
                </Stack>
                {row.createdBy === "Interne" ? (
                  <Typography color="text.secondary" fontWeight={400}>
                    {row.createdBy}
                  </Typography>
                ) : (
                  <>
                    <Link underline="none" href={`/profile/${row.createdBy}`}>
                      {row.createdBy}
                    </Link>
                    <Typography
                      fontSize={10}
                      color="text.secondary"
                      fontWeight={400}
                    >
                      {row?.specialist}
                    </Typography>
                  </>
                )}
              </Stack>
            </TableCell>
            <TableCell align="right">
              <Stack
                spacing={1}
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <IconButton
                  sx={{
                    "& svg path": {
                      fill: (theme) => theme.palette.text.primary,
                    },
                  }}
                >
                  <Icon path={"ic-voir"} />
                </IconButton>

                {/* <Popover /> */}
              </Stack>
            </TableCell>
          </>
        )}
      </RowStyled>
    </>
  );
}
